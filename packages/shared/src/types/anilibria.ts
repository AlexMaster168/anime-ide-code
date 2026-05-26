export type Quality = 'fhd' | 'hd' | 'sd';

export interface AniImageSet {
  src: string;
  preview: string;
  thumbnail: string;
  optimized?: {
    src?: string;
    preview?: string;
    thumbnail?: string;
  };
}

export interface AniName {
  main: string;
  english: string | null;
  alternative: string | null;
}

export interface AniValueLabel {
  value: string | number | null;
  description: string | null;
}

export interface AniGenre {
  id: number;
  name: string;
}

export interface AniMember {
  id: string;
  nickname: string | null;
  role?: { value: string; description: string } | null;
  user?: { id: number; nickname: string } | null;
}

export interface AniEpisode {
  id: string;
  name: string | null;
  ordinal: number;
  opening: { start: number | null; stop: number | null } | null;
  ending: { start: number | null; stop: number | null } | null;
  preview: AniImageSet | null;
  hls_480: string | null;
  hls_720: string | null;
  hls_1080: string | null;
  duration: number | null;
  rutube_id: string | null;
  youtube_id: string | null;
  sort_order: number;
  release_id: number;
  name_english: string | null;
}

export interface AniRelease {
  id: number;
  type: AniValueLabel;
  year: number;
  name: AniName;
  alias: string;
  season: AniValueLabel;
  poster: AniImageSet;
  fresh_at: string;
  created_at: string;
  updated_at: string;
  is_ongoing: boolean;
  age_rating: {
    value: string;
    label: string;
    is_adult: boolean;
    description: string;
  };
  publish_day: AniValueLabel;
  description: string | null;
  episodes_total: number | null;
  is_in_production: boolean;
  is_blocked_by_geo: boolean;
  is_blocked_by_copyrights: boolean;
  average_duration_of_episode: number | null;
  genres: AniGenre[];
  members: AniMember[];
  episodes: AniEpisode[];
}

export interface AniFranchiseImage {
  preview: string;
  thumbnail: string;
  optimized?: {
    preview?: string;
    thumbnail?: string;
  };
}

export interface AniFranchiseSummary {
  id: string;
  name: string;
  name_english?: string | null;
  image: AniFranchiseImage;
  rating?: number | null;
  first_year?: number | null;
  last_year?: number | null;
  total_episodes?: number | null;
  total_releases?: number | null;
  total_duration?: string | null;
  total_duration_in_seconds?: number | null;
}

export interface AniFranchiseReleaseRef {
  id: string;
  sort_order: number;
  release_id: number;
  franchise_id: string;
  release: AniRelease;
}

export interface AniFranchise extends AniFranchiseSummary {
  franchise_releases: AniFranchiseReleaseRef[];
}

export interface CatalogFilters {
  search?: string;
  yearFrom?: number;
  yearTo?: number;
  genreIds?: number[];
}
