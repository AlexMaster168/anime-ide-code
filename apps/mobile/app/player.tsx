import { router, useLocalSearchParams } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  availableQualities,
  fetchTitle,
  pickQuality,
  sortEpisodes,
} from '@anime-ide-code/shared';
import type { AniEpisode, AniRelease, Quality } from '@anime-ide-code/shared';
import { useHistory } from '../src/store/history';
import { colors } from '../src/theme/colors';

const QUALITY_LABEL: Record<Quality, string> = {
  fhd: '1080p',
  hd: '720p',
  sd: '480p',
};

export default function PlayerScreen() {
  const params = useLocalSearchParams<{
    titleId?: string;
    alias?: string;
    episode: string;
  }>();
  const lookup = params.alias ?? params.titleId ?? '';
  const episodeNum = Number(params.episode);

  const [title, setTitle] = useState<AniRelease | null>(null);
  const [currentEp, setCurrentEp] = useState(episodeNum);
  const [quality, setQuality] = useState<Quality>('hd');
  const [error, setError] = useState<string | null>(null);

  const upsertHistory = useHistory((s) => s.upsert);

  useEffect(() => {
    if (!lookup) return;
    fetchTitle(lookup)
      .then(setTitle)
      .catch((e: any) => setError(e?.message ?? 'Ошибка загрузки'));
  }, [lookup]);

  const episodes = useMemo(
    () => (title?.episodes ? sortEpisodes(title.episodes) : []),
    [title],
  );

  const episode: AniEpisode | null = useMemo(() => {
    return episodes.find((e) => e.ordinal === currentEp) ?? null;
  }, [episodes, currentEp]);

  const videoUrl = useMemo(() => {
    if (!episode) return null;
    const picked = pickQuality(episode, quality);
    return picked?.url ?? null;
  }, [episode, quality]);

  const player = useVideoPlayer(videoUrl, (p) => {
    p.play();
    p.timeUpdateEventInterval = 5;
  });

  useEffect(() => {
    if (!videoUrl) return;
    player.replace(videoUrl);
    player.play();
  }, [videoUrl, player]);

  useEffect(() => {
    const sub = player.addListener('timeUpdate', (ev) => {
      if (!title || !Number.isFinite(ev.currentTime)) return;
      upsertHistory({
        titleId: title.id,
        episode: currentEp,
        positionSec: Math.floor(ev.currentTime),
        durationSec: Math.floor(player.duration ?? 0),
      });
    });
    return () => sub.remove();
  }, [player, title, currentEp, upsertHistory]);

  if (error) {
    return (
      <SafeAreaView style={styles.errorWrap}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>Закрыть</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!title || !episode || !videoUrl) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  const qualities = availableQualities(episode);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>✕</Text>
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {title.name.main} — сер. {currentEp}
        </Text>
      </View>

      <View style={styles.videoBox}>
        <VideoView
          style={styles.video}
          player={player}
          contentFit="contain"
          nativeControls
        />
      </View>

      <View style={styles.controls}>
        <Text style={styles.label}>Качество</Text>
        <View style={styles.row}>
          {qualities.map((q) => (
            <Pressable
              key={q}
              onPress={() => setQuality(q)}
              style={[styles.chip, q === quality && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  q === quality && styles.chipTextActive,
                ]}
              >
                {QUALITY_LABEL[q]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Серии</Text>
        <View style={styles.epGrid}>
          {episodes.map((ep) => (
            <Pressable
              key={ep.id}
              onPress={() => setCurrentEp(ep.ordinal)}
              style={[
                styles.epChip,
                ep.ordinal === currentEp && styles.epChipActive,
              ]}
            >
              <Text
                style={[
                  styles.epChipText,
                  ep.ordinal === currentEp && styles.chipTextActive,
                ]}
              >
                {ep.ordinal}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  loadingWrap: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorWrap: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: { color: colors.danger, fontSize: 16, textAlign: 'center' },
  closeBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.bgCard,
    borderRadius: 10,
  },
  closeText: { color: colors.text, fontWeight: '600' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  back: { color: '#fff', fontSize: 22 },
  topTitle: { color: '#fff', fontSize: 15, flex: 1, fontWeight: '600' },
  videoBox: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  controls: { flex: 1, padding: 16, backgroundColor: colors.bg },
  label: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: { color: colors.textDim, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  epGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  epChip: {
    minWidth: 42,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  epChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  epChipText: { color: colors.text, fontWeight: '600' },
});
