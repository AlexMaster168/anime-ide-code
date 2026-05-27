import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchSchedule, posterUrl, WEEKDAYS } from '@anime-ide-code/shared';
import type { AniScheduleItem } from '@anime-ide-code/shared';
import { colors } from '../../src/theme/colors';

function todayValue(): number {
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
}

export default function ScheduleScreen() {
  const [items, setItems] = useState<AniScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchSchedule()
      .then(setItems)
      .catch((e: any) => setError(e?.message ?? 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  const byDay = useMemo(() => {
    const map = new Map<number, AniScheduleItem[]>();
    for (const it of items) {
      const day = Number(it.release.publish_day?.value ?? 0);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(it);
    }
    return map;
  }, [items]);

  const today = todayValue();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {loading ? (
        <View style={{ paddingVertical: 32 }}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      {WEEKDAYS.map((day) => {
        const dayItems = byDay.get(day.value) ?? [];
        if (dayItems.length === 0) return null;
        const isToday = day.value === today;
        return (
          <View key={day.value} style={{ marginBottom: 24 }}>
            <View style={styles.dayHeader}>
              <Text style={[styles.dayTitle, isToday && { color: colors.accent }]}>
                {day.label}
              </Text>
              {isToday ? (
                <View style={styles.todayBadge}>
                  <Text style={styles.todayText}>СЕГОДНЯ</Text>
                </View>
              ) : null}
              <Text style={styles.dayCount}>{dayItems.length}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
            >
              {dayItems.map((it) => {
                const t = it.release;
                const poster = posterUrl(
                  t.poster?.optimized?.src ??
                    t.poster?.src ??
                    t.poster?.preview ??
                    null,
                );
                const nextEp = it.next_release_episode_number;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => router.push(`/title/${t.alias}`)}
                    style={({ pressed }) => [
                      styles.card,
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <View style={styles.posterWrap}>
                      {poster ? (
                        <Image source={{ uri: poster }} style={styles.poster} />
                      ) : (
                        <View style={[styles.poster, styles.posterFallback]}>
                          <Text style={{ color: colors.textMuted }}>?</Text>
                        </View>
                      )}
                      {nextEp ? (
                        <View style={styles.epBadge}>
                          <Text style={styles.epBadgeText}>эп. {nextEp}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text numberOfLines={2} style={styles.name}>
                      {t.name.main}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  error: { color: colors.danger },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dayTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  todayBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  todayText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  dayCount: { color: colors.textMuted, fontSize: 13 },
  row: { gap: 10, paddingRight: 16 },
  card: { width: 110 },
  posterWrap: {
    width: 110,
    aspectRatio: 0.7,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    position: 'relative',
  },
  poster: { width: '100%', height: '100%' },
  posterFallback: { alignItems: 'center', justifyContent: 'center' },
  epBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(124,92,255,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  epBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  name: { color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 6 },
});
