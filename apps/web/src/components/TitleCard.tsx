import { Link } from 'react-router-dom';
import { posterUrl } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';

interface Props {
  title: AniRelease;
}

export function TitleCard({ title }: Props) {
  const poster = posterUrl(
    title.poster?.optimized?.src ??
      title.poster?.src ??
      title.poster?.preview ??
      null,
  );

  return (
    <Link
      to={`/title/${title.alias}`}
      className="group flex flex-col gap-2 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
    >
      <div className="relative aspect-[0.7] rounded-xl overflow-hidden bg-bg-card">
        {poster ? (
          <img
            src={poster}
            alt={title.name.main}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="size-full grid place-items-center text-text-muted text-2xl">
            ?
          </div>
        )}
        {title.episodes_total ? (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-text text-xs font-semibold">
            {title.episodes_total} эп.
          </div>
        ) : null}
        {title.is_ongoing ? (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-accent/85 text-white text-[10px] font-bold uppercase tracking-wide">
            ongoing
          </div>
        ) : null}
      </div>
      <div>
        <div className="text-text text-sm font-semibold line-clamp-2 group-hover:text-accent transition-colors">
          {title.name.main}
        </div>
        {title.name.english ? (
          <div className="text-text-dim text-xs mt-1 line-clamp-1">
            {title.name.english}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
