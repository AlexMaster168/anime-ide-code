import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FavoriteEntry {
  id: number;
  code: string;
  nameRu: string;
  nameEn: string;
  posterPath: string | null;
  addedAt: number;
}

interface FavoritesState {
  items: Record<number, FavoriteEntry>;
  toggle: (entry: Omit<FavoriteEntry, 'addedAt'>) => void;
  has: (id: number) => boolean;
  clear: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: {},
      toggle: (entry) =>
        set((state) => {
          const next = { ...state.items };
          if (next[entry.id]) {
            delete next[entry.id];
          } else {
            next[entry.id] = { ...entry, addedAt: Date.now() };
          }
          return { items: next };
        }),
      has: (id) => Boolean(get().items[id]),
      clear: () => set({ items: {} }),
    }),
    {
      name: 'favorites-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
