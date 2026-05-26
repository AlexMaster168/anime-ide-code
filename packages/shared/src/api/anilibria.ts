import axios from 'axios';
import type {
  AniEpisode,
  AniFranchise,
  AniFranchiseSummary,
  AniGenre,
  AniRelease,
  CatalogFilters,
  Quality,
} from '../types/anilibria';

const BASE_URL = 'https://anilibria.top/api/v1';
const STATIC_HOST = 'https://anilibria.top';

export const aniClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
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

function filtersToParams(filters?: CatalogFilters): Record<string, unknown> {
  if (!filters) return {};
  const params: Record<string, unknown> = {};
  if (filters.search) params['f[search]'] = filters.search;
  if (filters.yearFrom != null) params['f[years][from_year]'] = filters.yearFrom;
  if (filters.yearTo != null) params['f[years][to_year]'] = filters.yearTo;
  if (filters.genreIds?.length) {
    filters.genreIds.forEach((id, i) => {
      params[`f[genres][${i}]`] = id;
    });
  }
  return params;
}

export async function fetchCatalog(
  page = 1,
  limit = 30,
  filters?: CatalogFilters,
): Promise<CatalogPage> {
  const { data } = await aniClient.get<CatalogPage>('/anime/catalog/releases', {
    params: { page, limit, ...filtersToParams(filters) },
  });
  return data;
}

export interface FetchAllProgress {
  loaded: number;
  total: number;
}

/**
 * Тянет весь каталог постранично. Максимальный limit у API anilibria.top — 50.
 * Грузит параллельно пачками по `concurrency` запросов для скорости.
 * onProgress вызывается после каждой завершённой страницы.
 */
export async function fetchAllCatalog(
  filters?: CatalogFilters,
  onProgress?: (p: FetchAllProgress) => void,
  pageSize = 50,
  concurrency = 4,
): Promise<AniRelease[]> {
  const first = await fetchCatalog(1, pageSize, filters);
  const totalPages = first.meta.pagination.total_pages;
  const total = first.meta.pagination.total;
  const acc = new Map<number, AniRelease>();
  for (const r of first.data) acc.set(r.id, r);
  onProgress?.({ loaded: acc.size, total });

  // Параллельная пачкуемая загрузка остальных страниц
  for (let start = 2; start <= totalPages; start += concurrency) {
    const batch: Promise<CatalogPage>[] = [];
    for (let p = start; p < start + concurrency && p <= totalPages; p++) {
      batch.push(fetchCatalog(p, pageSize, filters));
    }
    const pages = await Promise.all(batch);
    for (const page of pages) {
      for (const r of page.data) acc.set(r.id, r);
    }
    onProgress?.({ loaded: acc.size, total });
  }
  return Array.from(acc.values());
}

export async function fetchGenres(): Promise<AniGenre[]> {
  const { data } = await aniClient.get<AniGenre[]>('/anime/genres');
  return data;
}

export async function searchTitles(
  query: string,
  limit = 40,
): Promise<AniRelease[]> {
  const { data } = await aniClient.get<AniRelease[]>('/app/search/releases', {
    params: { query, limit },
  });
  return data;
}

export async function fetchTitle(
  idOrAlias: number | string,
): Promise<AniRelease> {
  const { data } = await aniClient.get<AniRelease>(
    `/anime/releases/${encodeURIComponent(String(idOrAlias))}`,
  );
  return data;
}

export async function fetchReleaseFranchises(
  releaseId: number,
): Promise<AniFranchiseSummary[]> {
  const { data } = await aniClient.get<AniFranchiseSummary[]>(
    `/anime/franchises/release/${releaseId}`,
  );
  return data;
}

export async function fetchFranchise(franchiseId: string): Promise<AniFranchise> {
  const { data } = await aniClient.get<AniFranchise>(
    `/anime/franchises/${encodeURIComponent(franchiseId)}`,
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
