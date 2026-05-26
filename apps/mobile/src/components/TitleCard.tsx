import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { posterUrl } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';
import { colors } from '../theme/colors';

interface Props {
  title: AniRelease;
}

export function TitleCard({ title }: Props) {
  const poster = posterUrl(
    title.poster?.optimized?.src ??
      title.poster?.src ??
      title.poster?.preview ??
      null,
  );
  const episodes = title.episodes_total;

  return (
    <Pressable
      onPress={() => router.push(`/title/${title.alias}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.posterWrap}>
        {poster ? (
          <Image source={{ uri: poster }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={[styles.poster, styles.posterFallback]}>
            <Text style={{ color: colors.textMuted, fontSize: 24 }}>?</Text>
          </View>
        )}
        {episodes ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{episodes} эп.</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={2} style={styles.name}>
        {title.name.main}
      </Text>
      {title.name.english ? (
        <Text numberOfLines={1} style={styles.nameEn}>
          {title.name.english}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 16,
  },
  posterWrap: {
    aspectRatio: 0.7,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    marginBottom: 8,
    position: 'relative',
  },
  poster: { width: '100%', height: '100%' },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  name: { color: colors.text, fontSize: 14, fontWeight: '600' },
  nameEn: { color: colors.textDim, fontSize: 12, marginTop: 2 },
});
