import axios from 'axios';
import type { AniEpisode, AniRelease, Quality } from '../types/anilibria';

const BASE_URL = 'https://anilibria.top/api/v1';
const STATIC_HOST = 'https://anilibria.top';

export const aniClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export async function fetchUpdates(limit = 30): Promise<AniRelease[]> {
  const { data } = await aniClient.get<AniRelease[]>('/anime/releases/latest', {
    params: { limit },
  });
  return data;
}

export interface CatalogPage {
  data: AniRelease[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}

export async function fetchCatalog(page = 1, limit = 30): Promise<CatalogPage> {
  const { data } = await aniClient.get<CatalogPage>(
    '/anime/catalog/releases',
    { params: { page, limit } },
  );
  return data;
}

export async function searchTitles(query: string, limit = 40): Promise<AniRelease[]> {
  const { data } = await aniClient.get<AniRelease[]>('/app/search/releases', {
    params: { query, limit },
  });
  return data;
}

export async function fetchTitle(idOrAlias: number | string): Promise<AniRelease> {
  const { data } = await aniClient.get<AniRelease>(
    `/anime/releases/${encodeURIComponent(String(idOrAlias))}`,
  );
  return data;
}

export function posterUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STATIC_HOST}${path}`;
}

export function pickQuality(
  ep: Pick<AniEpisode, 'hls_480' | 'hls_720' | 'hls_1080'>,
  preferred: Quality,
): { quality: Quality; url: string } | null {
  const order: Quality[] = [preferred, 'hd', 'fhd', 'sd'];
  const map: Record<Quality, string | null> = {
    sd: ep.hls_480,
    hd: ep.hls_720,
    fhd: ep.hls_1080,
  };
  for (const q of order) {
    if (map[q]) return { quality: q, url: map[q]! };
  }
  return null;
}

export function availableQualities(
  ep: Pick<AniEpisode, 'hls_480' | 'hls_720' | 'hls_1080'>,
): Quality[] {
  const out: Quality[] = [];
  if (ep.hls_1080) out.push('fhd');
  if (ep.hls_720) out.push('hd');
  if (ep.hls_480) out.push('sd');
  return out;
}

export function sortEpisodes(episodes: AniEpisode[]): AniEpisode[] {
  return [...episodes].sort((a, b) => a.ordinal - b.ordinal);
}
