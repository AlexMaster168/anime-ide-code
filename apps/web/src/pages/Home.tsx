import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCatalog } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';
import { TitleCard } from '../components/TitleCard';
import { CenteredLoader, Loader } from '../components/Loader';

const PAGE_SIZE = 24;

export function HomePage() {
  const [titles, setTitles] = useState<AniRelease[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Не удалось загрузить';
      setError(msg);
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    setLoadingInitial(true);
    loadPage(1, true).finally(() => setLoadingInitial(false));
  }, [loadPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (loadingMore || loadingInitial) return;
        if (page >= totalPages) return;
        setLoadingMore(true);
        await loadPage(page + 1, false);
        setLoadingMore(false);
      },
      { rootMargin: '600px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadPage, loadingMore, loadingInitial, page, totalPages]);

  if (loadingInitial && titles.length === 0) {
    return <CenteredLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-text">
          Каталог{' '}
          <span className="text-text-muted text-base font-semibold">
            ({titles.length} из ~{totalPages * PAGE_SIZE})
          </span>
        </h1>
      </div>
      {error ? (
        <div className="mb-4 p-3 rounded-lg bg-bg-card border border-danger/40 text-danger text-sm">
          {error}
        </div>
      ) : null}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-5">
        {titles.map((t) => (
          <TitleCard key={t.id} title={t} />
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
      {loadingMore ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : null}
    </div>
  );
}
