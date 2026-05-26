import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchTitle, posterUrl, sortEpisodes } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';
import { useFavorites } from '../store/favorites';
import { CenteredLoader } from '../components/Loader';

export function TitlePage() {
  const { idOrAlias } = useParams<{ idOrAlias: string }>();
  const [title, setTitle] = useState<AniRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFavorite = useFavorites((s) => s.has);
  const toggleFavorite = useFavorites((s) => s.toggle);
  const isFav = title ? hasFavorite(title.id) : false;

  useEffect(() => {
    if (!idOrAlias) return;
    setLoading(true);
    setError(null);
    setTitle(null);
    fetchTitle(idOrAlias)
      .then(setTitle)
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Ошибка загрузки';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [idOrAlias]);

  const episodes = useMemo(
    () => (title?.episodes ? sortEpisodes(title.episodes) : []),
    [title],
  );

  if (loading) return <CenteredLoader />;

  if (error || !title) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-danger text-lg">{error ?? 'Не найдено'}</div>
      </div>
    );
  }

  const poster = posterUrl(title.poster?.src ?? title.poster?.preview ?? null);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        <div className="shrink-0 mx-auto md:mx-0">
          {poster ? (
            <img
              src={poster}
              alt={title.name.main}
              className="w-60 md:w-72 aspect-[0.7] object-cover rounded-2xl shadow-2xl"
            />
          ) : (
            <div className="w-60 md:w-72 aspect-[0.7] rounded-2xl bg-bg-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-text leading-tight">
            {title.name.main}
          </h1>
          {title.name.english ? (
            <div className="text-text-dim text-base mt-2">
              {title.name.english}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2 mt-4">
            {title.type?.description ? (
              <span className="px-2.5 py-1 rounded-md bg-bg-card text-text-dim text-xs font-medium">
                {title.type.description}
              </span>
            ) : null}
            {title.year ? (
              <span className="px-2.5 py-1 rounded-md bg-bg-card text-text-dim text-xs font-medium">
                {title.year}
              </span>
            ) : null}
            <span className="px-2.5 py-1 rounded-md bg-bg-card text-text-dim text-xs font-medium">
              {title.is_ongoing ? 'Онгоинг' : 'Завершён'}
            </span>
            {title.age_rating?.label ? (
              <span className="px-2.5 py-1 rounded-md bg-bg-card text-text-dim text-xs font-medium">
                {title.age_rating.label}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() =>
              toggleFavorite({
                id: title.id,
                code: title.alias,
                nameRu: title.name.main,
                nameEn: title.name.english ?? '',
                posterPath:
                  title.poster?.src ?? title.poster?.preview ?? null,
              })
            }
            className={[
              'mt-5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors',
              isFav
                ? 'bg-accent text-white hover:bg-accent-dim'
                : 'bg-bg-card text-text border border-border hover:border-accent',
            ].join(' ')}
          >
            {isFav ? '★ В избранном' : '☆ В избранное'}
          </button>

          {title.genres?.length ? (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {title.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-2.5 py-1 rounded-md bg-bg-card/60 text-text-dim text-xs"
                >
                  {g.name}
                </span>
              ))}
            </div>
          ) : null}

          {title.description ? (
            <p className="text-text mt-5 leading-relaxed text-[15px] whitespace-pre-wrap">
              {title.description}
            </p>
          ) : null}
        </div>
      </div>

      <h2 className="text-xl font-extrabold text-text mt-10 mb-4">
        Серии {episodes.length ? `(${episodes.length})` : ''}
      </h2>
      {episodes.length === 0 ? (
        <div className="text-text-muted py-4">Серий пока нет</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {episodes.map((ep) => (
            <li key={ep.id}>
              <Link
                to={`/player/${title.alias}/${ep.ordinal}`}
                className="group flex items-center gap-3 p-3 rounded-xl bg-bg-card hover:bg-bg-elevated border border-border hover:border-accent/40 transition-colors"
              >
                <div className="size-10 rounded-full bg-accent-dim grid place-items-center text-white font-extrabold text-sm shrink-0">
                  {ep.ordinal}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-text font-semibold truncate">
                    {ep.name ?? `Серия ${ep.ordinal}`}
                  </div>
                  <div className="text-text-muted text-xs mt-0.5">
                    {[
                      ep.hls_1080 && '1080p',
                      ep.hls_720 && '720p',
                      ep.hls_480 && '480p',
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </div>
                </div>
                <span className="text-accent text-lg group-hover:translate-x-0.5 transition-transform">
                  ▶
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
