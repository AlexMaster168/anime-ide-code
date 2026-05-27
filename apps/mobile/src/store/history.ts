import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface HistoryEntry {
  titleId: number;
  episode: number;
  positionSec: number;
  durationSec: number;
  updatedAt: number;
  alias?: string;
  nameRu?: string;
  posterPath?: string | null;
}

interface HistoryState {
  byTitle: Record<number, HistoryEntry>;
  upsert: (entry: Omit<HistoryEntry, 'updatedAt'>) => void;
  get: (titleId: number) => HistoryEntry | undefined;
  clear: () => void;
}

export const useHistory = create<HistoryState>()(
  persist(
    (set, get) => ({
      byTitle: {},
      upsert: (entry) =>
        set((state) => ({
          byTitle: {
            ...state.byTitle,
            [entry.titleId]: { ...entry, updatedAt: Date.now() },
          },
        })),
      get: (titleId) => get().byTitle[titleId],
      clear: () => set({ byTitle: {} }),
    }),
    {
      name: 'history-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
