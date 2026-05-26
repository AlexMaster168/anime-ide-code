import { router } from 'expo-router';
import { useMemo } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { posterUrl } from '@anime-ide-code/shared';
import { useFavorites, FavoriteEntry } from '../../src/store/favorites';
import { colors } from '../../src/theme/colors';

function Row({ entry, onRemove }: { entry: FavoriteEntry; onRemove: () => void }) {
  const poster = posterUrl(entry.posterPath);
  return (
    <Pressable
      onPress={() => router.push(`/title/${entry.code || entry.id}`)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      {poster ? (
        <Image source={{ uri: poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.posterFallback]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={2}>
          {entry.nameRu}
        </Text>
        {entry.nameEn ? (
          <Text style={styles.nameEn} numberOfLines={1}>
            {entry.nameEn}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={onRemove} hitSlop={10}>
        <Text style={styles.remove}>✕</Text>
      </TouchableOpacity>
    </Pressable>
  );
}

export default function FavoritesScreen() {
  const itemsMap = useFavorites((s) => s.items);
  const toggle = useFavorites((s) => s.toggle);
  const items = useMemo(
    () => Object.values(itemsMap).sort((a, b) => b.addedAt - a.addedAt),
    [itemsMap],
  );

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>
          Пока пусто.{'\n'}Тапни ★ на любом тайтле.
        </Text>
      </View>
    );
  }

  return (
    <FlashList
      data={items}
      keyExtractor={(it) => String(it.id)}
      renderItem={({ item }) => (
        <Row
          entry={item}
          onRemove={() =>
            toggle({
              id: item.id,
              code: item.code,
              nameRu: item.nameRu,
              nameEn: item.nameEn,
              posterPath: item.posterPath,
            })
          }
        />
      )}
      contentContainerStyle={{ padding: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    padding: 32,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    gap: 12,
  },
  poster: { width: 60, height: 84, borderRadius: 8, backgroundColor: colors.border },
  posterFallback: { backgroundColor: colors.bgElevated },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  nameEn: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  remove: { color: colors.danger, fontSize: 22, paddingHorizontal: 8 },
});
