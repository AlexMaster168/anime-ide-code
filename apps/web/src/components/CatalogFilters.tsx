import { useEffect, useState } from 'react';
import {
  fetchAgeRatings,
  fetchGenres,
  fetchSeasons,
  fetchTypes,
} from '@anime-ide-code/shared';
import type {
  AniGenre,
  AniReference,
  CatalogFilters,
} from '@anime-ide-code/shared';

interface Props {
  value: CatalogFilters;
  onChange: (v: CatalogFilters) => void;
}

const NOW = new Date().getFullYear();
const MIN_YEAR = 1965;

const PUBLISH_STATUSES: AniReference[] = [
  { value: 'IS_ONGOING', description: 'Онгоинг' },
  { value: 'IS_NOT_ONGOING', description: 'Завершён' },
];

export function CatalogFiltersBar({ value, onChange }: Props) {
  const [genres, setGenres] = useState<AniGenre[]>([]);
  const [types, setTypes] = useState<AniReference[]>([]);
  const [seasons, setSeasons] = useState<AniReference[]>([]);
  const [ratings, setRatings] = useState<AniReference[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchGenres()
      .then((g) => setGenres(g.sort((a, b) => a.name.localeCompare(b.name, 'ru'))))
      .catch(() => setGenres([]));
    fetchTypes().then(setTypes).catch(() => setTypes([]));
    fetchSeasons().then(setSeasons).catch(() => setSeasons([]));
    fetchAgeRatings().then(setRatings).catch(() => setRatings([]));
  }, []);

  const toggleIn = (arr: number[] | undefined, id: number): number[] => {
    const s = new Set(arr ?? []);
    s.has(id) ? s.delete(id) : s.add(id);
    return Array.from(s);
  };
  const toggleStr = (arr: string[] | undefined, v: string): string[] => {
    const s = new Set(arr ?? []);
    s.has(v) ? s.delete(v) : s.add(v);
    return Array.from(s);
  };

  const activeCount =
    (value.genreIds?.length ?? 0) +
    (value.types?.length ?? 0) +
    (value.seasons?.length ?? 0) +
    (value.ageRatings?.length ?? 0) +
    (value.publishStatuses?.length ?? 0) +
    (value.yearFrom != null ? 1 : 0) +
    (value.yearTo != null ? 1 : 0);

  const reset = () =>
    onChange({ search: value.search, sorting: value.sorting });

  return (
    <div>
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
          <FilterSection title="Годы">
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
          </FilterSection>

          {types.length > 0 ? (
            <FilterSection title="Тип">
              <ChipRow>
                {types.map((t) => (
                  <RefChip
                    key={t.value}
                    active={value.types?.includes(t.value)}
                    onClick={() =>
                      onChange({ ...value, types: toggleStr(value.types, t.value) })
                    }
                  >
                    {t.description}
                  </RefChip>
                ))}
              </ChipRow>
            </FilterSection>
          ) : null}

          <FilterSection title="Статус">
            <ChipRow>
              {PUBLISH_STATUSES.map((s) => (
                <RefChip
                  key={s.value}
                  active={value.publishStatuses?.includes(s.value)}
                  onClick={() =>
                    onChange({
                      ...value,
                      publishStatuses: toggleStr(value.publishStatuses, s.value),
                    })
                  }
                >
                  {s.description}
                </RefChip>
              ))}
            </ChipRow>
          </FilterSection>

          {seasons.length > 0 ? (
            <FilterSection title="Сезон">
              <ChipRow>
                {seasons.map((s) => (
                  <RefChip
                    key={s.value}
                    active={value.seasons?.includes(s.value)}
                    onClick={() =>
                      onChange({ ...value, seasons: toggleStr(value.seasons, s.value) })
                    }
                  >
                    {s.description}
                  </RefChip>
                ))}
              </ChipRow>
            </FilterSection>
          ) : null}

          {ratings.length > 0 ? (
            <FilterSection title="Возраст">
              <ChipRow>
                {ratings.map((r) => (
                  <RefChip
                    key={r.value}
                    active={value.ageRatings?.includes(r.value)}
                    onClick={() =>
                      onChange({
                        ...value,
                        ageRatings: toggleStr(value.ageRatings, r.value),
                      })
                    }
                  >
                    {r.label ?? r.description}
                  </RefChip>
                ))}
              </ChipRow>
            </FilterSection>
          ) : null}

          <FilterSection
            title={`Жанры ${value.genreIds?.length ? `(${value.genreIds.length})` : ''}`}
          >
            {genres.length === 0 ? (
              <div className="text-text-muted text-sm">Загружаю…</div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-auto">
                {genres.map((g) => (
                  <RefChip
                    key={g.id}
                    active={value.genreIds?.includes(g.id)}
                    onClick={() =>
                      onChange({ ...value, genreIds: toggleIn(value.genreIds, g.id) })
                    }
                  >
                    {g.name}
                  </RefChip>
                ))}
              </div>
            )}
          </FilterSection>
        </div>
      ) : null}
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
}

function RefChip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
        active
          ? 'bg-accent text-white border-accent'
          : 'bg-bg-elevated text-text-dim border-border hover:border-accent/40',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
