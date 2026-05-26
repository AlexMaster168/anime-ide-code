import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchAllCatalog, fetchCatalog } from '@anime-ide-code/shared';
import type {
  AniRelease,
  CatalogFilters,
  FetchAllProgress,
} from '@anime-ide-code/shared';
import { TitleCard } from '../components/TitleCard';
import { CenteredLoader, Loader } from '../components/Loader';
import { CatalogFiltersBar } from '../components/CatalogFilters';

const PAGE_SIZE = 24;

export function HomePage() {
  const [filters, setFilters] = useState<CatalogFilters>({});
  const [titles, setTitles] = useState<AniRelease[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [allProgress, setAllProgress] = useState<FetchAllProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Не удалось загрузить';
        setError(msg);
      } finally {
        inFlightRef.current = false;
      }
    },
    [],
  );

  // reload when filters change
  useEffect(() => {
    setLoadingInitial(true);
    setTitles([]);
    setPage(1);
    setLoadingAll(false);
    setAllProgress(null);
    loadPage(1, true, filters).finally(() => setLoadingInitial(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    if (loadingAll) return;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (loadingMore || loadingInitial || loadingAll) return;
        if (page >= totalPages) return;
        setLoadingMore(true);
        await loadPage(page + 1, false, filters);
        setLoadingMore(false);
      },
      { rootMargin: '600px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadPage, loadingMore, loadingInitial, loadingAll, page, totalPages, filters]);

  const loadEverything = async () => {
    setLoadingAll(true);
    setError(null);
    setAllProgress({ loaded: titles.length, total });
    try {
      const all = await fetchAllCatalog(filters, (p) => setAllProgress(p));
      setTitles(all);
      setTotal(all.length);
      setTotalPages(1);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка загрузки';
      setError(msg);
    } finally {
      setLoadingAll(false);
    }
  };

  if (loadingInitial && titles.length === 0) return <CenteredLoader />;

  const allLoaded = titles.length >= total && total > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-text">
          Каталог{' '}
          <span className="text-text-muted text-base font-semibold">
            ({titles.length} из {total})
          </span>
        </h1>
        {!allLoaded && !loadingAll && total > titles.length ? (
          <button
            type="button"
            onClick={loadEverything}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-dim transition-colors"
          >
            Загрузить все {total} →
          </button>
        ) : null}
        {loadingAll && allProgress ? (
          <div className="flex items-center gap-3">
            <Loader size="sm" />
            <span className="text-text-dim text-sm">
              {allProgress.loaded} / {allProgress.total}
            </span>
          </div>
        ) : null}
      </div>

      <CatalogFiltersBar value={filters} onChange={setFilters} />

      {error ? (
        <div className="mb-4 p-3 rounded-lg bg-bg-card border border-danger/40 text-danger text-sm">
          {error}
        </div>
      ) : null}

      {titles.length === 0 && !loadingInitial ? (
        <div className="text-text-muted text-center py-16">
          По заданным фильтрам ничего не нашлось.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-5">
          {titles.map((t) => (
            <TitleCard key={t.id} title={t} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-10" />
      {loadingMore ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : null}
    </div>
  );
}
