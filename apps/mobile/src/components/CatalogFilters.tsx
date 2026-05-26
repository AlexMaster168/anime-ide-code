import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { fetchGenres } from '@anime-ide-code/shared';
import type { AniGenre, CatalogFilters } from '@anime-ide-code/shared';
import { colors } from '../theme/colors';

interface Props {
  value: CatalogFilters;
  onChange: (v: CatalogFilters) => void;
}

const NOW = new Date().getFullYear();

export function CatalogFiltersBar({ value, onChange }: Props) {
  const [genres, setGenres] = useState<AniGenre[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CatalogFilters>(value);

  useEffect(() => {
    fetchGenres()
      .then((g) => setGenres(g.sort((a, b) => a.name.localeCompare(b.name, 'ru'))))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const activeCount = useMemo(
    () =>
      (value.genreIds?.length ?? 0) +
      (value.yearFrom != null ? 1 : 0) +
      (value.yearTo != null ? 1 : 0),
    [value],
  );

  const toggleGenre = (id: number) => {
    const cur = new Set(draft.genreIds ?? []);
    if (cur.has(id)) cur.delete(id);
    else cur.add(id);
    setDraft({ ...draft, genreIds: Array.from(cur) });
  };

  const apply = () => {
    onChange(draft);
    setOpen(false);
  };

  const reset = () => {
    const next = { search: value.search };
    setDraft(next);
    onChange(next);
    setOpen(false);
  };

  return (
    <>
      <View style={styles.bar}>
        <Pressable
          style={[styles.btn, activeCount > 0 && styles.btnActive]}
          onPress={() => setOpen(true)}
        >
          <Text style={[styles.btnText, activeCount > 0 && styles.btnTextActive]}>
            ⚙ Фильтры{activeCount > 0 ? `  ${activeCount}` : ''}
          </Text>
        </Pressable>
        {activeCount > 0 ? (
          <Pressable onPress={reset} hitSlop={6}>
            <Text style={styles.reset}>Сбросить</Text>
          </Pressable>
        ) : null}
      </View>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Фильтры</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={styles.label}>Годы</Text>
              <View style={styles.yearsRow}>
                <TextInput
                  style={styles.yearInput}
                  keyboardType="number-pad"
                  placeholder="с"
                  placeholderTextColor={colors.textMuted}
                  value={draft.yearFrom?.toString() ?? ''}
                  onChangeText={(t) =>
                    setDraft({ ...draft, yearFrom: t ? Number(t) : undefined })
                  }
                />
                <Text style={styles.dash}>—</Text>
                <TextInput
                  style={styles.yearInput}
                  keyboardType="number-pad"
                  placeholder={String(NOW)}
                  placeholderTextColor={colors.textMuted}
                  value={draft.yearTo?.toString() ?? ''}
                  onChangeText={(t) =>
                    setDraft({ ...draft, yearTo: t ? Number(t) : undefined })
                  }
                />
              </View>

              <Text style={styles.label}>
                Жанры {draft.genreIds?.length ? `(${draft.genreIds.length})` : ''}
              </Text>
              <View style={styles.genres}>
                {genres.map((g) => {
                  const active = draft.genreIds?.includes(g.id);
                  return (
                    <Pressable
                      key={g.id}
                      onPress={() => toggleGenre(g.id)}
                      style={[styles.chip, active && styles.chipActive]}
                    >
                      <Text
                        style={[styles.chipText, active && styles.chipTextActive]}
                      >
                        {g.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.sheetFooter}>
              <Pressable style={[styles.actionBtn, styles.actionSecondary]} onPress={reset}>
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Сбросить
                </Text>
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={apply}>
                <Text style={styles.actionText}>Применить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  btnText: { color: colors.textDim, fontWeight: '700', fontSize: 13 },
  btnTextActive: { color: '#fff' },
  reset: { color: colors.danger, fontSize: 13, fontWeight: '600' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '85%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  close: { color: colors.text, fontSize: 22, paddingHorizontal: 4 },
  label: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  yearsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  yearInput: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15,
  },
  dash: { color: colors.textMuted, fontSize: 14 },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textDim, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  sheetFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionSecondary: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
