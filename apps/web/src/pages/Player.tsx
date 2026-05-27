import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
} from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import {
  availableQualities,
  fetchTitle,
  pickQuality,
  sortEpisodes,
} from '@anime-ide-code/shared';
import type { AniEpisode, AniRelease, Quality } from '@anime-ide-code/shared';
import { useHistory } from '../store/history';
import { CenteredLoader } from '../components/Loader';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

const QUALITY_LABEL: Record<Quality, string> = {
  fhd: '1080p',
  hd: '720p',
  sd: '480p',
};

export function PlayerPage() {
  const { idOrAlias, episode } = useParams<{
    idOrAlias: string;
    episode: string;
  }>();
  const navigate = useNavigate();
  const episodeNum = Number(episode);

  const [title, setTitle] = useState<AniRelease | null>(null);
  const [currentEp, setCurrentEp] = useState(episodeNum);
  const [quality, setQuality] = useState<Quality>('hd');
  const [error, setError] = useState<string | null>(null);

  const upsertHistory = useHistory((s) => s.upsert);
  const historyEntry = useHistory((s) =>
    title ? s.byTitle[title.id] : undefined,
  );
  const playerRef = useRef<MediaPlayerInstance | null>(null);
  const seekedRef = useRef(false);

  useEffect(() => {
    if (!idOrAlias) return;
    setError(null);
    setTitle(null);
    fetchTitle(idOrAlias)
      .then(setTitle)
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Ошибка загрузки';
        setError(msg);
      });
  }, [idOrAlias]);

  useEffect(() => {
    setCurrentEp(episodeNum);
    seekedRef.current = false;
  }, [episodeNum]);

  const episodes = useMemo(
    () => (title?.episodes ? sortEpisodes(title.episodes) : []),
    [title],
  );

  const episodeObj: AniEpisode | null = useMemo(
    () => episodes.find((e) => e.ordinal === currentEp) ?? null,
    [episodes, currentEp],
  );

  const videoUrl = useMemo(() => {
    if (!episodeObj) return null;
    return pickQuality(episodeObj, quality)?.url ?? null;
  }, [episodeObj, quality]);

  const qualities = episodeObj ? availableQualities(episodeObj) : [];

  const onTimeUpdate = useCallback(() => {
    const p = playerRef.current;
    if (!title || !p) return;
    const current = p.currentTime;
    const dur = p.duration;
    if (!Number.isFinite(current)) return;
    upsertHistory({
      titleId: title.id,
      episode: currentEp,
      positionSec: Math.floor(current),
      durationSec: Math.floor(Number.isFinite(dur) ? dur : 0),
      alias: title.alias,
      nameRu: title.name.main,
      posterPath: title.poster?.src ?? title.poster?.preview ?? null,
    });
  }, [title, currentEp, upsertHistory]);

  const onLoadedMetadata = useCallback(() => {
    const p = playerRef.current;
    if (!p || seekedRef.current) return;
    if (
      historyEntry &&
      historyEntry.episode === currentEp &&
      historyEntry.positionSec > 5 &&
      historyEntry.durationSec > 0 &&
      historyEntry.positionSec < historyEntry.durationSec - 10
    ) {
      p.currentTime = historyEntry.positionSec;
    }
    seekedRef.current = true;
  }, [historyEntry, currentEp]);

  const goToEpisode = (ord: number) => {
    if (!title) return;
    navigate(`/player/${title.alias}/${ord}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black grid place-items-center px-4 text-center">
        <div>
          <div className="text-danger text-lg mb-4">{error}</div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-bg-card text-text font-semibold"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  if (!title || !episodeObj || !videoUrl) {
    return (
      <div className="min-h-screen bg-black">
        <CenteredLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="bg-bg-elevated/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="size-9 grid place-items-center rounded-lg hover:bg-bg-card text-text text-xl"
            aria-label="Назад"
          >
            ✕
          </button>
          <Link
            to={`/title/${title.alias}`}
            className="text-text font-semibold truncate hover:text-accent transition-colors flex-1 min-w-0"
          >
            {title.name.main}{' '}
            <span className="text-text-dim font-normal">— сер. {currentEp}</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row xl:items-start xl:gap-6 xl:max-w-[1600px] xl:mx-auto xl:w-full xl:p-6">
        <div className="bg-black flex-1 xl:rounded-2xl xl:overflow-hidden">
          <MediaPlayer
            ref={playerRef}
            key={videoUrl}
            src={{ src: videoUrl, type: 'application/x-mpegurl' }}
            aspectRatio="16/9"
            playsInline
            autoPlay
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            streamType="on-demand"
            crossOrigin
            className="bg-black ring-0 outline-none"
          >
            <MediaProvider />
            <DefaultVideoLayout
              icons={defaultLayoutIcons}
              colorScheme="dark"
            />
          </MediaPlayer>
        </div>

        <aside className="xl:w-80 xl:shrink-0">
          <div className="p-4 lg:p-6 space-y-5">
            <div>
              <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">
                Качество
              </div>
              <div className="flex gap-2 flex-wrap">
                {qualities.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    className={[
                      'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                      q === quality
                        ? 'bg-accent text-white border-accent'
                        : 'bg-bg-card text-text-dim border-border hover:border-accent/40',
                    ].join(' ')}
                  >
                    {QUALITY_LABEL[q]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-text-dim text-xs font-bold uppercase tracking-wider mb-2">
                Серии
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 xl:grid-cols-6 gap-2">
                {episodes.map((ep) => (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => goToEpisode(ep.ordinal)}
                    className={[
                      'h-10 rounded-lg text-sm font-semibold border transition-colors',
                      ep.ordinal === currentEp
                        ? 'bg-accent text-white border-accent'
                        : 'bg-bg-card text-text border-border hover:border-accent/40',
                    ].join(' ')}
                  >
                    {ep.ordinal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
