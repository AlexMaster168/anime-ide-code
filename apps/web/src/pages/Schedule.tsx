import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSchedule, posterUrl, WEEKDAYS } from '@anime-ide-code/shared';
import type { AniScheduleItem } from '@anime-ide-code/shared';
import { CenteredLoader } from '../components/Loader';

// JS getDay(): 0=Sun..6=Sat → наш value 1=Mon..7=Sun
function todayValue(): number {
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
}

export function SchedulePage() {
  const [items, setItems] = useState<AniScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchSchedule()
      .then(setItems)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Ошибка загрузки'),
      )
      .finally(() => setLoading(false));
  }, []);

  const byDay = useMemo(() => {
    const map = new Map<number, AniScheduleItem[]>();
    for (const it of items) {
      const day = Number(it.release.publish_day?.value ?? 0);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(it);
    }
    return map;
  }, [items]);

  const today = todayValue();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <h1 className="text-2xl lg:text-3xl font-extrabold text-text mb-6">
        Расписание{' '}
        <span className="text-text-muted text-base font-semibold">
          (онгоинги по дням)
        </span>
      </h1>

      {loading ? (
        <CenteredLoader />
      ) : error ? (
        <div className="text-danger py-12 text-center">{error}</div>
      ) : null}

      <div className="space-y-8">
        {WEEKDAYS.map((day) => {
          const dayItems = byDay.get(day.value) ?? [];
          if (dayItems.length === 0) return null;
          const isToday = day.value === today;
          return (
            <section key={day.value}>
              <div className="flex items-center gap-3 mb-3">
                <h2
                  className={[
                    'text-lg font-extrabold',
                    isToday ? 'text-accent' : 'text-text',
                  ].join(' ')}
                >
                  {day.label}
                </h2>
                {isToday ? (
                  <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider">
                    сегодня
                  </span>
                ) : null}
                <span className="text-text-muted text-sm">
                  {dayItems.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-5">
                {dayItems.map((it) => {
                  const t = it.release;
                  const poster = posterUrl(
                    t.poster?.optimized?.src ??
                      t.poster?.src ??
                      t.poster?.preview ??
                      null,
                  );
                  const nextEp = it.next_release_episode_number;
                  return (
                    <Link
                      key={t.id}
                      to={`/title/${t.alias}`}
                      className="group flex flex-col gap-2"
                    >
                      <div className="relative aspect-[0.7] rounded-xl overflow-hidden bg-bg-card">
                        {poster ? (
                          <img
                            src={poster}
                            alt={t.name.main}
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="size-full grid place-items-center text-text-muted text-2xl">
                            ?
                          </div>
                        )}
                        {nextEp ? (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-accent/85 text-white text-[10px] font-bold">
                            эп. {nextEp}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-text text-sm font-semibold line-clamp-2 group-hover:text-accent transition-colors">
                        {t.name.main}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
