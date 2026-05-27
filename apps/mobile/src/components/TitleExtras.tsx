import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  fetchRecommended,
  fetchReleaseMembers,
  fetchReleaseTorrents,
  formatBytes,
  posterUrl,
} from '@anime-ide-code/shared';
import type {
  AniMemberFull,
  AniRelease,
  AniTorrent,
} from '@anime-ide-code/shared';
import { colors } from '../theme/colors';

export function RecommendedBlock({ releaseId }: { releaseId: number }) {
  const [items, setItems] = useState<AniRelease[]>([]);
  useEffect(() => {
    let cancel = false;
    setItems([]);
    fetchRecommended(releaseId, 12)
      .then((r) => !cancel && setItems(r))
      .catch(() => !cancel && setItems([]));
    return () => {
      cancel = true;
    };
  }, [releaseId]);

  if (items.length === 0) return null;

  return (
    <View style={styles.block}>
      <Text style={styles.heading}>Тебе понравится</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((t) => {
          const poster = posterUrl(
            t.poster?.optimized?.src ?? t.poster?.src ?? t.poster?.preview ?? null,
          );
          return (
            <Pressable
              key={t.id}
              onPress={() => router.push(`/title/${t.alias}`)}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.poster}>
                {poster ? <Image source={{ uri: poster }} style={styles.posterImg} /> : null}
              </View>
              <Text numberOfLines={2} style={styles.cardName}>
                {t.name.main}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function MembersBlock({ releaseId }: { releaseId: number }) {
  const [members, setMembers] = useState<AniMemberFull[]>([]);
  useEffect(() => {
    let cancel = false;
    setMembers([]);
    fetchReleaseMembers(releaseId)
      .then((m) => !cancel && setMembers(m))
      .catch(() => !cancel && setMembers([]));
    return () => {
      cancel = true;
    };
  }, [releaseId]);

  const byRole = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const m of members) {
      const role = m.role?.description ?? 'Участники';
      const name = m.nickname ?? m.user?.nickname;
      if (!name) continue;
      if (!map.has(role)) map.set(role, []);
      map.get(role)!.push(name);
    }
    return Array.from(map.entries());
  }, [members]);

  if (byRole.length === 0) return null;

  return (
    <View style={styles.block}>
      <Text style={styles.heading}>Над озвучкой работали</Text>
      {byRole.map(([role, names]) => (
        <View key={role} style={styles.memberRow}>
          <Text style={styles.memberRole}>{role}</Text>
          <Text style={styles.memberNames}>{names.join(' · ')}</Text>
        </View>
      ))}
    </View>
  );
}

export function TorrentsBlock({ releaseId }: { releaseId: number }) {
  const [torrents, setTorrents] = useState<AniTorrent[]>([]);
  useEffect(() => {
    let cancel = false;
    setTorrents([]);
    fetchReleaseTorrents(releaseId)
      .then((t) => !cancel && setTorrents(t))
      .catch(() => !cancel && setTorrents([]));
    return () => {
      cancel = true;
    };
  }, [releaseId]);

  if (torrents.length === 0) return null;
  const sorted = [...torrents].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <View style={styles.block}>
      <Text style={styles.heading}>Скачать (торрент)</Text>
      {sorted.map((t) => (
        <View key={t.id} style={styles.torrentRow}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.torrentTitle} numberOfLines={1}>
              {t.quality?.description ?? t.label}
            </Text>
            <Text style={styles.torrentMeta}>
              {[
                t.codec?.label,
                t.type?.description,
                formatBytes(t.size),
                `↑${t.seeders}`,
                `↓${t.leechers}`,
              ]
                .filter(Boolean)
                .join('  ·  ')}
            </Text>
          </View>
          <Pressable
            style={styles.magnetBtn}
            onPress={() => Linking.openURL(t.magnet).catch(() => {})}
          >
            <Text style={styles.magnetText}>⤓</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: 24, paddingHorizontal: 16 },
  heading: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 12 },
  row: { gap: 10, paddingRight: 16 },
  card: { width: 110 },
  poster: {
    width: 110,
    aspectRatio: 0.7,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
  },
  posterImg: { width: '100%', height: '100%' },
  cardName: { color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 6 },
  memberRow: { flexDirection: 'row', marginBottom: 8, gap: 10 },
  memberRole: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    width: 110,
  },
  memberNames: { color: colors.text, fontSize: 13, flex: 1 },
  torrentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  torrentTitle: { color: colors.text, fontSize: 14, fontWeight: '600' },
  torrentMeta: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  magnetBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  magnetText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
