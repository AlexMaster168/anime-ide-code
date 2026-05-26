import { useEffect, useState } from 'react';
import { fetchGenres } from '@anime-ide-code/shared';
import type { AniGenre, CatalogFilters } from '@anime-ide-code/shared';

interface Props {
  value: CatalogFilters;
  onChange: (v: CatalogFilters) => void;
}

const NOW = new Date().getFullYear();
const MIN_YEAR = 1965;

export function CatalogFiltersBar({ value, onChange }: Props) {
  const [genres, setGenres] = useState<AniGenre[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchGenres()
      .then((g) => setGenres(g.sort((a, b) => a.name.localeCompare(b.name, 'ru'))))
      .catch(() => setGenres([]));
  }, []);

  const toggleGenre = (id: number) => {
    const cur = new Set(value.genreIds ?? []);
    if (cur.has(id)) cur.delete(id);
    else cur.add(id);
    onChange({ ...value, genreIds: Array.from(cur) });
  };

  const activeCount =
    (value.genreIds?.length ?? 0) +
    (value.yearFrom != null ? 1 : 0) +
    (value.yearTo != null ? 1 : 0);

  const reset = () =>
    onChange({ search: value.search, genreIds: [], yearFrom: undefined, yearTo: undefined });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={[
            'px-3.5 py-2 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-2',
            activeCount > 0 || open
              ? 'bg-accent text-white border-accent'
              : 'bg-bg-card text-text border-border hover:border-accent/40',
          ].join(' ')}
        >
          <span>⚙</span>
          <span>Фильтры</span>
          {activeCount > 0 ? (
            <span className="ml-1 size-5 rounded-full bg-white/25 text-xs grid place-items-center">
              {activeCount}
            </span>
          ) : null}
        </button>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="px-3 py-2 rounded-lg text-sm text-text-dim hover:text-danger transition-colors"
          >
            Сбросить
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="mt-4 p-4 rounded-xl bg-bg-card border border-border space-y-5">
          <div>
            <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">
              Годы
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={MIN_YEAR}
                max={NOW + 1}
                placeholder={String(MIN_YEAR)}
                value={value.yearFrom ?? ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    yearFrom: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-24 bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text text-sm outline-none focus:border-accent"
              />
              <span className="text-text-muted">—</span>
              <input
                type="number"
                min={MIN_YEAR}
                max={NOW + 1}
                placeholder={String(NOW)}
                value={value.yearTo ?? ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    yearTo: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-24 bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">
              Жанры {value.genreIds?.length ? `(${value.genreIds.length})` : ''}
            </div>
            {genres.length === 0 ? (
              <div className="text-text-muted text-sm">Загружаю…</div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-64 overflow-auto">
                {genres.map((g) => {
                  const active = value.genreIds?.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGenre(g.id)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                        active
                          ? 'bg-accent text-white border-accent'
                          : 'bg-bg-elevated text-text-dim border-border hover:border-accent/40',
                      ].join(' ')}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
