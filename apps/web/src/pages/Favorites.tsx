import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { posterUrl } from '@anime-ide-code/shared';
import { useFavorites } from '../store/favorites';

export function FavoritesPage() {
  const itemsMap = useFavorites((s) => s.items);
  const toggle = useFavorites((s) => s.toggle);
  const items = useMemo(
    () => Object.values(itemsMap).sort((a, b) => b.addedAt - a.addedAt),
    [itemsMap],
  );

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4 opacity-50">★</div>
        <div className="text-text-dim text-lg">
          Пока пусто.
          <br />
          Нажми ★ на любом тайтле.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
      <h1 className="text-2xl lg:text-3xl font-extrabold text-text mb-6">
        Избранное{' '}
        <span className="text-text-muted text-base font-semibold">
          ({items.length})
        </span>
      </h1>
      <ul className="flex flex-col gap-3">
        {items.map((entry) => {
          const poster = posterUrl(entry.posterPath);
          return (
            <li
              key={entry.id}
              className="group flex items-center gap-4 p-3 rounded-xl bg-bg-card hover:bg-bg-elevated border border-border transition-colors"
            >
              <Link
                to={`/title/${entry.code || entry.id}`}
                className="flex items-center gap-4 flex-1 min-w-0"
              >
                {poster ? (
                  <img
                    src={poster}
                    alt=""
                    className="w-16 h-22 rounded-lg object-cover bg-bg-elevated shrink-0"
                  />
                ) : (
                  <div className="w-16 h-22 rounded-lg bg-bg-elevated shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-text font-semibold line-clamp-2 group-hover:text-accent transition-colors">
                    {entry.nameRu}
                  </div>
                  {entry.nameEn ? (
                    <div className="text-text-dim text-sm mt-1 line-clamp-1">
                      {entry.nameEn}
                    </div>
                  ) : null}
                </div>
              </Link>
              <button
                type="button"
                onClick={() =>
                  toggle({
                    id: entry.id,
                    code: entry.code,
                    nameRu: entry.nameRu,
                    nameEn: entry.nameEn,
                    posterPath: entry.posterPath,
                  })
                }
                className="text-danger size-10 grid place-items-center rounded-lg hover:bg-danger/10 transition-colors shrink-0"
                aria-label="Удалить из избранного"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
