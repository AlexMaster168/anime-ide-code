import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { posterUrl } from '@anime-ide-code/shared';
import { useHistory } from '../store/history';

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ContinueWatching() {
  const byTitle = useHistory((s) => s.byTitle);
  const items = useMemo(
    () =>
      Object.values(byTitle)
        .filter((h) => h.alias && h.positionSec > 5)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 12),
    [byTitle],
  );

  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-extrabold text-text mb-4">Продолжить просмотр</h2>
      <div className="grid grid-flow-col auto-cols-[160px] sm:auto-cols-[180px] gap-4 overflow-x-auto pb-2 -mx-4 px-4 lg:-mx-8 lg:px-8">
        {items.map((h) => {
          const poster = posterUrl(h.posterPath);
          const pct =
            h.durationSec > 0
              ? Math.min(100, Math.round((h.positionSec / h.durationSec) * 100))
              : 0;
          return (
            <Link
              key={h.titleId}
              to={`/player/${h.alias}/${h.episode}`}
              className="group block"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-bg-card border border-border group-hover:border-accent/40 transition-colors">
                {poster ? (
                  <img
                    src={poster}
                    alt={h.nameRu ?? ''}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="size-11 rounded-full bg-black/55 backdrop-blur grid place-items-center text-white text-lg border border-white/20">
                    ▶
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                  <div className="flex items-center justify-between text-[11px] text-white/90 font-mono mb-1">
                    <span>сер. {h.episode}</span>
                    <span>{fmt(h.positionSec)}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/25 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm font-semibold text-text line-clamp-1 group-hover:text-accent transition-colors">
                {h.nameRu ?? h.alias}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
