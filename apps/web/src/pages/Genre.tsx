import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGenre, fetchGenreReleases } from '@anime-ide-code/shared';
import type { AniGenre, AniRelease } from '@anime-ide-code/shared';
import { TitleCard } from '../components/TitleCard';
import { CenteredLoader, Loader } from '../components/Loader';

const PAGE_SIZE = 30;

export function GenrePage() {
  const { id } = useParams<{ id: string }>();
  const genreId = Number(id);

  const [genre, setGenre] = useState<AniGenre | null>(null);
  const [titles, setTitles] = useState<AniRelease[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const inFlightRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadPage = useCallback(
    async (targetPage: number, replace: boolean) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        const res = await fetchGenreReleases(genreId, targetPage, PAGE_SIZE);
        setTotalPages(res.meta.pagination.total_pages);
        setTotal(res.meta.pagination.total);
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
    setLoadingInitial(true);
    setTitles([]);
    setPage(1);
    fetchGenre(genreId)
      .then(setGenre)
      .catch(() => setGenre(null));
    loadPage(1, true).finally(() => setLoadingInitial(false));
  }, [genreId, loadPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (loadingMore || loadingInitial || page >= totalPages) return;
        setLoadingMore(true);
        await loadPage(page + 1, false);
        setLoadingMore(false);
      },
      { rootMargin: '600px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadPage, loadingMore, loadingInitial, page, totalPages]);

  if (loadingInitial && titles.length === 0) return <CenteredLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <h1 className="text-2xl lg:text-3xl font-extrabold text-text mb-6">
        {genre?.name ?? 'Жанр'}{' '}
        <span className="text-text-muted text-base font-semibold">
          ({total})
        </span>
      </h1>
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
