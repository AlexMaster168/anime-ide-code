import { useMemo } from 'react';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { posterUrl } from '@anime-ide-code/shared';
import { useHistory } from '../store/history';
import { colors } from '../theme/colors';

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ContinueWatching() {
  const byTitle = useHistory((s) => s.byTitle);
  const items = useMemo(
    () =>
      Object.values(byTitle)
        .filter((h) => h.alias && h.positionSec > 5)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 12),
    [byTitle],
  );

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Продолжить просмотр</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((h) => {
          const poster = posterUrl(h.posterPath);
          const pct =
            h.durationSec > 0
              ? Math.min(100, Math.round((h.positionSec / h.durationSec) * 100))
              : 0;
          return (
            <Pressable
              key={h.titleId}
              onPress={() =>
                router.push(`/player?alias=${h.alias}&episode=${h.episode}`)
              }
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.thumb}>
                {poster ? (
                  <Image source={{ uri: poster }} style={styles.thumbImg} />
                ) : null}
                <View style={styles.scrim} />
                <View style={styles.playWrap}>
                  <Text style={styles.play}>▶</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>сер. {h.episode}</Text>
                  <Text style={styles.metaText}>{fmt(h.positionSec)}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
              </View>
              <Text numberOfLines={1} style={styles.name}>
                {h.nameRu ?? h.alias}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  heading: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  row: { gap: 12, paddingRight: 16 },
  card: { width: 200 },
  thumb: {
    width: 200,
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  thumbImg: { width: '100%', height: '100%' },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  playWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    color: '#fff',
    fontSize: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 44,
    backgroundColor: 'rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  metaRow: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '600' },
  barTrack: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    right: 8,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 2 },
  name: { color: colors.text, fontSize: 13, fontWeight: '600', marginTop: 6 },
});
