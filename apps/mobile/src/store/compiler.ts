import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LANG_PRESETS } from '@anime-ide-code/shared';

interface CompilerState {
  langId: string;
  sources: Record<string, string>;
  setLang: (langId: string) => void;
  setSource: (langId: string, source: string) => void;
  resetCurrent: () => void;
}

const initialSources: Record<string, string> = Object.fromEntries(
  LANG_PRESETS.map((p) => [p.id, p.starter]),
);

export const useCompiler = create<CompilerState>()(
  persist(
    (set) => ({
      langId: 'python',
      sources: initialSources,
      setLang: (langId) => set({ langId }),
      setSource: (langId, source) =>
        set((s) => ({ sources: { ...s.sources, [langId]: source } })),
      resetCurrent: () =>
        set((s) => {
          const preset = LANG_PRESETS.find((p) => p.id === s.langId);
          if (!preset) return s;
          return { sources: { ...s.sources, [s.langId]: preset.starter } };
        }),
    }),
    {
      name: 'compiler-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
