import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchTitle, posterUrl, sortEpisodes } from '@anime-ide-code/shared';
import type { AniRelease } from '@anime-ide-code/shared';
import { useFavorites } from '../../src/store/favorites';
import { FranchiseBlock } from '../../src/components/FranchiseBlock';
import {
  MembersBlock,
  RecommendedBlock,
  TorrentsBlock,
} from '../../src/components/TitleExtras';
import { colors } from '../../src/theme/colors';

export default function TitleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState<AniRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFavorite = useFavorites((s) => s.has);
  const toggleFavorite = useFavorites((s) => s.toggle);
  const isFav = title ? hasFavorite(title.id) : false;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchTitle(id)
      .then(setTitle)
      .catch((e: any) => setError(e?.message ?? 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [id]);

  const episodes = useMemo(
    () => (title?.episodes ? sortEpisodes(title.episodes) : []),
    [title],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }
  if (error || !title) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Не найдено'}</Text>
      </View>
    );
  }

  const poster = posterUrl(
    title.poster?.src ?? title.poster?.preview ?? null,
  );

  return (
    <>
      <Stack.Screen options={{ title: title.name.main }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          {poster ? (
            <Image source={{ uri: poster }} style={styles.poster} />
          ) : (
            <View style={[styles.poster, { backgroundColor: colors.bgCard }]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.nameRu}>{title.name.main}</Text>
            {title.name.english ? (
              <Text style={styles.nameEn}>{title.name.english}</Text>
            ) : null}
            <View style={styles.metaRow}>
              {title.type?.description ? (
                <Text style={styles.metaItem}>{title.type.description}</Text>
              ) : null}
              {title.year ? (
                <Text style={styles.metaItem}>{title.year}</Text>
              ) : null}
              <Text style={styles.metaItem}>
                {title.is_ongoing ? 'Онгоинг' : 'Завершён'}
              </Text>
              {title.age_rating?.label ? (
                <Text style={styles.metaItem}>{title.age_rating.label}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() =>
                toggleFavorite({
                  id: title.id,
                  code: title.alias,
                  nameRu: title.name.main,
                  nameEn: title.name.english ?? '',
                  posterPath:
                    title.poster?.src ?? title.poster?.preview ?? null,
                })
              }
              style={[styles.favBtn, isFav && styles.favBtnActive]}
            >
              <Text style={[styles.favText, isFav && { color: '#fff' }]}>
                {isFav ? '★ В избранном' : '☆ В избранное'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {title.genres?.length ? (
          <View style={styles.tags}>
            {title.genres.map((g) => (
              <Pressable
                key={g.id}
                style={styles.tag}
                onPress={() => router.push(`/genre/${g.id}`)}
              >
                <Text style={styles.tagText}>{g.name}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {title.description ? (
          <Text style={styles.description}>{title.description}</Text>
        ) : null}

        <FranchiseBlock releaseId={title.id} currentReleaseId={title.id} />

        <Text style={styles.sectionTitle}>
          Серии {episodes.length ? `(${episodes.length})` : ''}
        </Text>
        {episodes.length === 0 ? (
          <Text style={styles.empty}>Серий пока нет</Text>
        ) : (
          episodes.map((ep) => (
            <Pressable
              key={ep.id}
              onPress={() =>
                router.push({
                  pathname: '/player',
                  params: {
                    titleId: String(title.id),
                    alias: title.alias,
                    episode: String(ep.ordinal),
                  },
                })
              }
              style={({ pressed }) => [
                styles.epRow,
                pressed && { opacity: 0.6 },
              ]}
            >
              <View style={styles.epIndex}>
                <Text style={styles.epIndexText}>{ep.ordinal}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.epName}>
                  {ep.name ?? `Серия ${ep.ordinal}`}
                </Text>
                <Text style={styles.epQualities}>
                  {[ep.hls_1080 && '1080p', ep.hls_720 && '720p', ep.hls_480 && '480p']
                    .filter(Boolean)
                    .join(' • ')}
                </Text>
              </View>
              <Text style={styles.epPlay}>▶</Text>
            </Pressable>
          ))
        )}

        <MembersBlock releaseId={title.id} />
        <RecommendedBlock releaseId={title.id} />
        <TorrentsBlock releaseId={title.id} />

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
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
  header: { flexDirection: 'row', padding: 16, gap: 14 },
  poster: { width: 130, height: 186, borderRadius: 10 },
  nameRu: { color: colors.text, fontSize: 18, fontWeight: '800' },
  nameEn: { color: colors.textDim, fontSize: 13, marginTop: 4 },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 10, flexWrap: 'wrap' },
  metaItem: { color: colors.textMuted, fontSize: 12 },
  favBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  favBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  favText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.bgCard,
  },
  tagText: { color: colors.textDim, fontSize: 12 },
  description: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  empty: { color: colors.textMuted, padding: 16 },
  epRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    alignItems: 'center',
    gap: 12,
  },
  epIndex: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  epIndexText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  epName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  epQualities: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  epPlay: { color: colors.accent, fontSize: 18, paddingHorizontal: 6 },
});
