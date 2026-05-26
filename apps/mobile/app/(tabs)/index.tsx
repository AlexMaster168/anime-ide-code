import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { fetchCatalog } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';
import { TitleCard } from '../../src/components/TitleCard';
import { colors } from '../../src/theme/colors';

const PAGE_SIZE = 24;

export default function HomeScreen() {
  const [titles, setTitles] = useState<AniRelease[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const loadPage = useCallback(async (targetPage: number, replace: boolean) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      setError(null);
      const res = await fetchCatalog(targetPage, PAGE_SIZE);
      setTotalPages(res.meta.pagination.total_pages);
      setPage(targetPage);
      setTitles((prev) => {
        if (replace) return res.data;
        const seen = new Set(prev.map((t) => t.id));
        const fresh = res.data.filter((t) => !seen.has(t.id));
        return [...prev, ...fresh];
      });
    } catch (e: any) {
      setError(e?.message ?? 'Не удалось загрузить');
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    setLoadingInitial(true);
    loadPage(1, true).finally(() => setLoadingInitial(false));
  }, [loadPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }, [loadPage]);

  const onEndReached = useCallback(async () => {
    if (loadingMore || loadingInitial) return;
    if (page >= totalPages) return;
    setLoadingMore(true);
    await loadPage(page + 1, false);
    setLoadingMore(false);
  }, [loadingMore, loadingInitial, page, totalPages, loadPage]);

  if (loadingInitial && titles.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlashList
        data={titles}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, paddingLeft: index % 2 === 0 ? 0 : 8 }}>
            <TitleCard title={item} />
          </View>
        )}
        ListHeaderComponent={
          <Text style={styles.header}>
            Каталог{' '}
            <Text style={styles.headerDim}>
              ({titles.length} из {totalPages * PAGE_SIZE})
            </Text>
          </Text>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : null
        }
        contentContainerStyle={{ padding: 16 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
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
  header: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  headerDim: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  error: {
    color: colors.danger,
    padding: 16,
    backgroundColor: colors.bgElevated,
  },
});
