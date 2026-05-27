import { useEffect, useState } from 'react';
import { fetchReleaseTorrents, formatBytes } from '@anime-ide-code/shared';
import type { AniTorrent } from '@anime-ide-code/shared';

export function TorrentsBlock({ releaseId }: { releaseId: number }) {
  const [torrents, setTorrents] = useState<AniTorrent[]>([]);

  useEffect(() => {
    let cancel = false;
    setTorrents([]);
    fetchReleaseTorrents(releaseId)
      .then((t) => !cancel && setTorrents(t))
      .catch(() => !cancel && setTorrents([]));
    return () => {
      cancel = true;
    };
  }, [releaseId]);

  if (torrents.length === 0) return null;

  const sorted = [...torrents].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-extrabold text-text mb-4">Скачать (торрент)</h2>
      <ul className="flex flex-col gap-2">
        {sorted.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-border"
          >
            <div className="flex-1 min-w-0">
              <div className="text-text text-sm font-semibold truncate">
                {t.quality?.description ?? t.label}
              </div>
              <div className="text-text-muted text-xs mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-mono">
                {t.codec?.label ? <span>{t.codec.label}</span> : null}
                {t.type?.description ? <span>{t.type.description}</span> : null}
                <span>{formatBytes(t.size)}</span>
                <span className="text-ok">↑{t.seeders}</span>
                <span className="text-danger">↓{t.leechers}</span>
                {t.is_hardsub ? <span>hardsub</span> : null}
              </div>
            </div>
            <a
              href={t.magnet}
              className="shrink-0 px-3 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-dim transition-colors"
              title="Открыть magnet-ссылку в торрент-клиенте"
            >
              ⤓ magnet
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
