import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { fetchGenre, fetchGenreReleases } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';
import { TitleCard } from '../../src/components/TitleCard';
import { colors } from '../../src/theme/colors';

const PAGE_SIZE = 30;

export default function GenreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const genreId = Number(id);

  const [name, setName] = useState('Жанр');
  const [titles, setTitles] = useState<AniRelease[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const inFlightRef = useRef(false);

  const loadPage = useCallback(
    async (targetPage: number, replace: boolean) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        const res = await fetchGenreReleases(genreId, targetPage, PAGE_SIZE);
        setTotalPages(res.meta.pagination.total_pages);
        setPage(targetPage);
        setTitles((prev) => {
          if (replace) return res.data;
          const seen = new Set(prev.map((t) => t.id));
          return [...prev, ...res.data.filter((t) => !seen.has(t.id))];
        });
      } finally {
        inFlightRef.current = false;
      }
    },
    [genreId],
  );

  useEffect(() => {
    fetchGenre(genreId)
      .then((g) => setName(g.name))
      .catch(() => {});
    setLoadingInitial(true);
    loadPage(1, true).finally(() => setLoadingInitial(false));
  }, [genreId, loadPage]);

  const onEndReached = useCallback(async () => {
    if (loadingMore || loadingInitial || page >= totalPages) return;
    setLoadingMore(true);
    await loadPage(page + 1, false);
    setLoadingMore(false);
  }, [loadingMore, loadingInitial, page, totalPages, loadPage]);

  if (loadingInitial && titles.length === 0) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: name }} />
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: name }} />
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
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
