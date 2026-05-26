import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { fetchAllCatalog, fetchCatalog } from '@anime-ide-code/shared';
import type {
  AniRelease,
  CatalogFilters,
  FetchAllProgress,
} from '@anime-ide-code/shared';
import { TitleCard } from '../../src/components/TitleCard';
import { CatalogFiltersBar } from '../../src/components/CatalogFilters';
import { colors } from '../../src/theme/colors';

const PAGE_SIZE = 24;

export default function HomeScreen() {
  const [filters, setFilters] = useState<CatalogFilters>({});
  const [titles, setTitles] = useState<AniRelease[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [allProgress, setAllProgress] = useState<FetchAllProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const loadPage = useCallback(
    async (targetPage: number, replace: boolean, useFilters: CatalogFilters) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        setError(null);
        const res = await fetchCatalog(targetPage, PAGE_SIZE, useFilters);
        setTotalPages(res.meta.pagination.total_pages);
        setTotal(res.meta.pagination.total);
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
    },
    [],
  );

  useEffect(() => {
    setLoadingInitial(true);
    setTitles([]);
    setPage(1);
    setLoadingAll(false);
    setAllProgress(null);
    loadPage(1, true, filters).finally(() => setLoadingInitial(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPage(1, true, filters);
    setRefreshing(false);
  }, [loadPage, filters]);

  const onEndReached = useCallback(async () => {
    if (loadingMore || loadingInitial || loadingAll) return;
    if (page >= totalPages) return;
    setLoadingMore(true);
    await loadPage(page + 1, false, filters);
    setLoadingMore(false);
  }, [loadingMore, loadingInitial, loadingAll, page, totalPages, filters, loadPage]);

  const loadEverything = async () => {
    setLoadingAll(true);
    setError(null);
    setAllProgress({ loaded: titles.length, total });
    try {
      const all = await fetchAllCatalog(filters, (p) => setAllProgress(p));
      setTitles(all);
      setTotal(all.length);
      setTotalPages(1);
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка загрузки');
    } finally {
      setLoadingAll(false);
    }
  };

  if (loadingInitial && titles.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const allLoaded = titles.length >= total && total > 0;

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
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.header}>
                Каталог{' '}
                <Text style={styles.headerDim}>
                  ({titles.length} из {total})
                </Text>
              </Text>
              {!allLoaded && !loadingAll && total > titles.length ? (
                <Pressable style={styles.loadAllBtn} onPress={loadEverything}>
                  <Text style={styles.loadAllText}>Всё ({total}) →</Text>
                </Pressable>
              ) : null}
              {loadingAll && allProgress ? (
                <Text style={styles.progressText}>
                  {allProgress.loaded} / {allProgress.total}
                </Text>
              ) : null}
            </View>
            <CatalogFiltersBar value={filters} onChange={setFilters} />
          </View>
        }
        ListEmptyComponent={
          !loadingInitial ? (
            <Text style={styles.empty}>
              По фильтрам ничего не нашлось
            </Text>
          ) : null
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  header: { color: colors.text, fontSize: 22, fontWeight: '800', flexShrink: 1 },
  headerDim: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  loadAllBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  loadAllText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  progressText: { color: colors.textDim, fontSize: 12 },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: 32 },
  error: {
    color: colors.danger,
    padding: 16,
    backgroundColor: colors.bgElevated,
  },
});
