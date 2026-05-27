import axios from 'axios';
import type {
  AniEpisode,
  AniFranchise,
  AniFranchiseSummary,
  AniGenre,
  AniMemberFull,
  AniReference,
  AniRelease,
  AniScheduleItem,
  AniTorrent,
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
  if (filters.sorting) params['f[sorting]'] = filters.sorting;
  filters.types?.forEach((v, i) => (params[`f[types][${i}]`] = v));
  filters.seasons?.forEach((v, i) => (params[`f[seasons][${i}]`] = v));
  filters.ageRatings?.forEach((v, i) => (params[`f[age_ratings][${i}]`] = v));
  filters.publishStatuses?.forEach(
    (v, i) => (params[`f[publish_statuses][${i}]`] = v),
  );
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

export async function fetchSchedule(): Promise<AniScheduleItem[]> {
  const { data } = await aniClient.get<AniScheduleItem[]>(
    '/anime/schedule/week',
  );
  return data;
}

export async function fetchRandomReleases(limit = 1): Promise<AniRelease[]> {
  const { data } = await aniClient.get<AniRelease[]>(
    '/anime/releases/random',
    { params: { limit } },
  );
  return data;
}

export const WEEKDAYS: { value: number; label: string }[] = [
  { value: 1, label: 'Понедельник' },
  { value: 2, label: 'Вторник' },
  { value: 3, label: 'Среда' },
  { value: 4, label: 'Четверг' },
  { value: 5, label: 'Пятница' },
  { value: 6, label: 'Суббота' },
  { value: 7, label: 'Воскресенье' },
];

export async function fetchTypes(): Promise<AniReference[]> {
  const { data } = await aniClient.get<AniReference[]>(
    '/anime/catalog/references/types',
  );
  return data;
}

export async function fetchSeasons(): Promise<AniReference[]> {
  const { data } = await aniClient.get<AniReference[]>(
    '/anime/catalog/references/seasons',
  );
  return data;
}

export async function fetchAgeRatings(): Promise<AniReference[]> {
  const { data } = await aniClient.get<AniReference[]>(
    '/anime/catalog/references/age-ratings',
  );
  return data;
}

export async function fetchRecommended(
  forReleaseId: number,
  limit = 12,
): Promise<AniRelease[]> {
  const { data } = await aniClient.get<AniRelease[]>(
    '/anime/releases/recommended',
    { params: { forRecReleaseId: forReleaseId, limit } },
  );
  return data;
}

export async function fetchReleaseMembers(
  idOrAlias: number | string,
): Promise<AniMemberFull[]> {
  const { data } = await aniClient.get<AniMemberFull[]>(
    `/anime/releases/${encodeURIComponent(String(idOrAlias))}/members`,
  );
  return data;
}

export async function fetchGenreReleases(
  genreId: number,
  page = 1,
  limit = 30,
): Promise<CatalogPage> {
  const { data } = await aniClient.get<CatalogPage>(
    `/anime/genres/${genreId}/releases`,
    { params: { page, limit } },
  );
  return data;
}

export async function fetchGenre(genreId: number): Promise<AniGenre> {
  const { data } = await aniClient.get<AniGenre>(`/anime/genres/${genreId}`);
  return data;
}

export async function fetchReleaseTorrents(
  releaseId: number,
): Promise<AniTorrent[]> {
  const { data } = await aniClient.get<AniTorrent[]>(
    `/anime/torrents/release/${releaseId}`,
  );
  return data;
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '—';
  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
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
