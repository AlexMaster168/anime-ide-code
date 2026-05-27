import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecommended, posterUrl } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';

export function RecommendedBlock({ releaseId }: { releaseId: number }) {
  const [items, setItems] = useState<AniRelease[]>([]);

  useEffect(() => {
    let cancel = false;
    setItems([]);
    fetchRecommended(releaseId, 12)
      .then((r) => !cancel && setItems(r))
      .catch(() => !cancel && setItems([]));
    return () => {
      cancel = true;
    };
  }, [releaseId]);

  if (items.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-extrabold text-text mb-4">Тебе понравится</h2>
      <div className="grid grid-flow-col auto-cols-[140px] sm:auto-cols-[160px] gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:-mx-8 lg:px-8">
        {items.map((t) => {
          const poster = posterUrl(
            t.poster?.optimized?.src ?? t.poster?.src ?? t.poster?.preview ?? null,
          );
          return (
            <Link key={t.id} to={`/title/${t.alias}`} className="group block">
              <div className="aspect-[0.7] rounded-lg overflow-hidden bg-bg-card border border-transparent group-hover:border-accent/40 transition-colors">
                {poster ? (
                  <img
                    src={poster}
                    alt={t.name.main}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : null}
              </div>
              <div className="mt-2 text-xs font-semibold text-text line-clamp-2 group-hover:text-accent transition-colors">
                {t.name.main}
              </div>
              <div className="text-text-muted text-[11px] mt-0.5">{t.year}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
