import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { searchTitles } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';
import { TitleCard } from '../../src/components/TitleCard';
import { colors } from '../../src/theme/colors';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [titles, setTitles] = useState<AniRelease[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setTitles([]);
      setError(null);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchTitles(q, 40);
        setTitles(data);
      } catch (e: any) {
        setError(e?.message ?? 'Ошибка поиска');
        setTitles([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Название тайтла…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : titles.length === 0 && query.trim().length >= 2 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Ничего не нашлось</Text>
        </View>
      ) : (
        <FlashList
          data={titles}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1, paddingLeft: index % 2 === 0 ? 0 : 8 }}>
              <TitleCard title={item} />
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchWrap: { padding: 12, backgroundColor: colors.bgElevated },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { color: colors.textMuted, fontSize: 14 },
  error: { color: colors.danger, padding: 16 },
});
