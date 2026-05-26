import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  fetchFranchise,
  fetchReleaseFranchises,
  posterUrl,
} from '@anime-ide-code/shared';
import type {
  AniFranchise,
  AniFranchiseReleaseRef,
} from '@anime-ide-code/shared';
import { colors } from '../theme/colors';

interface Props {
  releaseId: number;
  currentReleaseId: number;
}

export function FranchiseBlock({ releaseId, currentReleaseId }: Props) {
  const [franchises, setFranchises] = useState<AniFranchise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setFranchises([]);
    (async () => {
      try {
        const summaries = await fetchReleaseFranchises(releaseId);
        if (cancel) return;
        const detailed = await Promise.all(
          summaries.map((s) => fetchFranchise(s.id).catch(() => null)),
        );
        if (cancel) return;
        setFranchises(detailed.filter((f): f is AniFranchise => Boolean(f)));
      } catch {
        if (!cancel) setFranchises([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [releaseId]);

  if (loading || franchises.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {franchises.map((f) => {
        const sorted = [...f.franchise_releases].sort(
          (a, b) => a.sort_order - b.sort_order,
        );
        return (
          <View key={f.id} style={{ marginBottom: 16 }}>
            <View style={styles.header}>
              <Text style={styles.title}>{f.name}</Text>
              <Text style={styles.meta}>
                {sorted.length} ч.
                {f.total_episodes ? ` · ${f.total_episodes} эп.` : ''}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
            >
              {sorted.map((r) => (
                <FranchiseCard
                  key={r.id}
                  ref_={r}
                  isCurrent={r.release_id === currentReleaseId}
                />
              ))}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}

function FranchiseCard({
  ref_,
  isCurrent,
}: {
  ref_: AniFranchiseReleaseRef;
  isCurrent: boolean;
}) {
  const poster = posterUrl(
    ref_.release.poster?.optimized?.src ??
      ref_.release.poster?.src ??
      ref_.release.poster?.preview ??
      null,
  );

  return (
    <Pressable
      onPress={() => {
        if (isCurrent) return;
        router.push(`/title/${ref_.release.alias}`);
      }}
      style={({ pressed }) => [styles.card, pressed && !isCurrent && { opacity: 0.7 }]}
    >
      <View style={[styles.posterWrap, isCurrent && styles.posterWrapCurrent]}>
        {poster ? (
          <Image source={{ uri: poster }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterFallback]}>
            <Text style={{ color: colors.textMuted, fontSize: 20 }}>?</Text>
          </View>
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{ref_.sort_order}</Text>
        </View>
        {isCurrent ? (
          <View style={styles.current}>
            <Text style={styles.currentText}>СЕЙЧАС</Text>
          </View>
        ) : null}
      </View>
      <Text
        numberOfLines={2}
        style={[styles.name, isCurrent && { color: colors.accent }]}
      >
        {ref_.release.name.main}
      </Text>
      <Text style={styles.year}>{ref_.release.year}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
  },
  title: { color: colors.text, fontSize: 16, fontWeight: '800' },
  meta: { color: colors.textMuted, fontSize: 12 },
  row: { gap: 10, paddingRight: 16 },
  card: { width: 120 },
  posterWrap: {
    aspectRatio: 0.7,
    width: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  posterWrapCurrent: { borderColor: colors.accent },
  poster: { width: '100%', height: '100%' },
  posterFallback: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  current: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: colors.accent,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  currentText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  name: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  year: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
