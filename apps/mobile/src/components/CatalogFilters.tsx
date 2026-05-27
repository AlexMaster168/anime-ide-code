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
import {
  fetchAgeRatings,
  fetchGenres,
  fetchSeasons,
  fetchTypes,
} from '@anime-ide-code/shared';
import type {
  AniGenre,
  AniReference,
  CatalogFilters,
} from '@anime-ide-code/shared';
import { colors } from '../theme/colors';

interface Props {
  value: CatalogFilters;
  onChange: (v: CatalogFilters) => void;
}

const NOW = new Date().getFullYear();

const PUBLISH_STATUSES: AniReference[] = [
  { value: 'IS_ONGOING', description: 'Онгоинг' },
  { value: 'IS_NOT_ONGOING', description: 'Завершён' },
];

export function CatalogFiltersBar({ value, onChange }: Props) {
  const [genres, setGenres] = useState<AniGenre[]>([]);
  const [types, setTypes] = useState<AniReference[]>([]);
  const [seasons, setSeasons] = useState<AniReference[]>([]);
  const [ratings, setRatings] = useState<AniReference[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CatalogFilters>(value);

  useEffect(() => {
    fetchGenres()
      .then((g) => setGenres(g.sort((a, b) => a.name.localeCompare(b.name, 'ru'))))
      .catch(() => setGenres([]));
    fetchTypes().then(setTypes).catch(() => setTypes([]));
    fetchSeasons().then(setSeasons).catch(() => setSeasons([]));
    fetchAgeRatings().then(setRatings).catch(() => setRatings([]));
  }, []);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const activeCount = useMemo(
    () =>
      (value.genreIds?.length ?? 0) +
      (value.types?.length ?? 0) +
      (value.seasons?.length ?? 0) +
      (value.ageRatings?.length ?? 0) +
      (value.publishStatuses?.length ?? 0) +
      (value.yearFrom != null ? 1 : 0) +
      (value.yearTo != null ? 1 : 0),
    [value],
  );

  const toggleNum = (arr: number[] | undefined, id: number) => {
    const s = new Set(arr ?? []);
    s.has(id) ? s.delete(id) : s.add(id);
    return Array.from(s);
  };
  const toggleStr = (arr: string[] | undefined, v: string) => {
    const s = new Set(arr ?? []);
    s.has(v) ? s.delete(v) : s.add(v);
    return Array.from(s);
  };

  const apply = () => {
    onChange(draft);
    setOpen(false);
  };
  const reset = () => {
    const next = { search: value.search, sorting: value.sorting };
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

              {types.length > 0 ? (
                <Section title="Тип">
                  {types.map((t) => (
                    <Chip
                      key={t.value}
                      active={draft.types?.includes(t.value)}
                      onPress={() =>
                        setDraft({ ...draft, types: toggleStr(draft.types, t.value) })
                      }
                      label={t.description ?? t.value}
                    />
                  ))}
                </Section>
              ) : null}

              <Section title="Статус">
                {PUBLISH_STATUSES.map((s) => (
                  <Chip
                    key={s.value}
                    active={draft.publishStatuses?.includes(s.value)}
                    onPress={() =>
                      setDraft({
                        ...draft,
                        publishStatuses: toggleStr(draft.publishStatuses, s.value),
                      })
                    }
                    label={s.description ?? s.value}
                  />
                ))}
              </Section>

              {seasons.length > 0 ? (
                <Section title="Сезон">
                  {seasons.map((s) => (
                    <Chip
                      key={s.value}
                      active={draft.seasons?.includes(s.value)}
                      onPress={() =>
                        setDraft({ ...draft, seasons: toggleStr(draft.seasons, s.value) })
                      }
                      label={s.description ?? s.value}
                    />
                  ))}
                </Section>
              ) : null}

              {ratings.length > 0 ? (
                <Section title="Возраст">
                  {ratings.map((r) => (
                    <Chip
                      key={r.value}
                      active={draft.ageRatings?.includes(r.value)}
                      onPress={() =>
                        setDraft({
                          ...draft,
                          ageRatings: toggleStr(draft.ageRatings, r.value),
                        })
                      }
                      label={r.label ?? r.description ?? r.value}
                    />
                  ))}
                </Section>
              ) : null}

              <Section
                title={`Жанры ${draft.genreIds?.length ? `(${draft.genreIds.length})` : ''}`}
              >
                {genres.map((g) => (
                  <Chip
                    key={g.id}
                    active={draft.genreIds?.includes(g.id)}
                    onPress={() =>
                      setDraft({ ...draft, genreIds: toggleNum(draft.genreIds, g.id) })
                    }
                    label={g.name}
                  />
                ))}
              </Section>
            </ScrollView>

            <View style={styles.sheetFooter}>
              <Pressable style={[styles.actionBtn, styles.actionSecondary]} onPress={reset}>
                <Text style={[styles.actionText, { color: colors.text }]}>Сбросить</Text>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.chips}>{children}</View>
    </>
  );
}

function Chip({
  active,
  onPress,
  label,
}: {
  active?: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '88%',
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
    marginTop: 16,
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
