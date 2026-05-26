import { useEffect, useState } from 'react';
import { searchTitles } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';
import { TitleCard } from '../components/TitleCard';
import { Loader } from '../components/Loader';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [titles, setTitles] = useState<AniRelease[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setTitles([]);
      setError(null);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchTitles(q, 40);
        setTitles(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Ошибка поиска';
        setError(msg);
        setTitles([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="sticky top-14 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 bg-bg/80 backdrop-blur z-10 border-b border-border mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Название тайтла…"
          autoFocus
          className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted outline-none focus:border-accent transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="text-danger p-4">{error}</div>
      ) : titles.length === 0 && query.trim().length >= 2 ? (
        <div className="text-text-muted text-center py-12">
          Ничего не нашлось
        </div>
      ) : titles.length === 0 ? (
        <div className="text-text-muted text-center py-12">
          Введи минимум 2 символа
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-5">
          {titles.map((t) => (
            <TitleCard key={t.id} title={t} />
          ))}
        </div>
      )}
    </div>
  );
}
