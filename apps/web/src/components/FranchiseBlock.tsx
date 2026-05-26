import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchFranchise,
  fetchReleaseFranchises,
  posterUrl,
} from '@anime-ide-code/shared';
import type {
  AniFranchise,
  AniFranchiseReleaseRef,
} from '@anime-ide-code/shared';

interface Props {
  releaseId: number;
  currentReleaseId: number;
}

export function FranchiseBlock({ releaseId, currentReleaseId }: Props) {
  const [franchises, setFranchises] = useState<AniFranchise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setFranchises([]);
    (async () => {
      try {
        const summaries = await fetchReleaseFranchises(releaseId);
        if (cancel) return;
        const detailed = await Promise.all(
          summaries.map((s) => fetchFranchise(s.id).catch(() => null)),
        );
        if (cancel) return;
        setFranchises(detailed.filter((f): f is AniFranchise => Boolean(f)));
      } catch {
        if (!cancel) setFranchises([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [releaseId]);

  if (loading) {
    return (
      <div className="mt-8">
        <div className="h-6 w-32 bg-bg-card rounded mb-3 animate-pulse" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-32 shrink-0">
              <div className="aspect-[0.7] rounded-lg bg-bg-card animate-pulse" />
              <div className="h-4 mt-2 bg-bg-card rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (franchises.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      {franchises.map((f) => {
        const sorted = [...f.franchise_releases].sort(
          (a, b) => a.sort_order - b.sort_order,
        );
        return (
          <FranchiseRow
            key={f.id}
            franchise={f}
            releases={sorted}
            currentReleaseId={currentReleaseId}
          />
        );
      })}
    </div>
  );
}

function FranchiseRow({
  franchise,
  releases,
  currentReleaseId,
}: {
  franchise: AniFranchise;
  releases: AniFranchiseReleaseRef[];
  currentReleaseId: number;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3">
        <h3 className="text-lg font-extrabold text-text">{franchise.name}</h3>
        <span className="text-text-muted text-sm">
          {releases.length} {pluralize(releases.length, 'часть', 'части', 'частей')}
          {franchise.total_episodes
            ? ` · ${franchise.total_episodes} эп.`
            : ''}
          {franchise.total_duration ? ` · ${franchise.total_duration}` : ''}
        </span>
      </div>
      <div className="grid grid-flow-col auto-cols-[140px] sm:auto-cols-[160px] gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:-mx-8 lg:px-8 scrollbar-thin">
        {releases.map((r) => {
          const isCurrent = r.release_id === currentReleaseId;
          const poster = posterUrl(
            r.release.poster?.optimized?.src ??
              r.release.poster?.src ??
              r.release.poster?.preview ??
              null,
          );
          return (
            <Link
              key={r.id}
              to={`/title/${r.release.alias}`}
              className={[
                'group block focus:outline-none',
                isCurrent ? 'pointer-events-none' : '',
              ].join(' ')}
            >
              <div
                className={[
                  'relative aspect-[0.7] rounded-lg overflow-hidden bg-bg-card border-2',
                  isCurrent
                    ? 'border-accent shadow-[0_0_0_2px_rgba(124,92,255,0.25)]'
                    : 'border-transparent group-hover:border-accent/40',
                ].join(' ')}
              >
                {poster ? (
                  <img
                    src={poster}
                    alt={r.release.name.main}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="size-full grid place-items-center text-text-muted text-xl">
                    ?
                  </div>
                )}
                <div className="absolute top-1.5 left-1.5 size-6 rounded-full bg-black/70 text-white text-[11px] font-bold grid place-items-center">
                  {r.sort_order}
                </div>
                {isCurrent ? (
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 rounded bg-accent text-white text-[10px] font-bold uppercase tracking-wider text-center">
                    Сейчас
                  </div>
                ) : null}
              </div>
              <div
                className={[
                  'mt-2 text-xs font-semibold line-clamp-2 transition-colors',
                  isCurrent
                    ? 'text-accent'
                    : 'text-text group-hover:text-accent',
                ].join(' ')}
              >
                {r.release.name.main}
              </div>
              <div className="text-text-muted text-[11px] mt-0.5">
                {r.release.year}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function pluralize(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
