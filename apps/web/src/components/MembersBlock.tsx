import { useEffect, useMemo, useState } from 'react';
import { fetchReleaseMembers } from '@anime-ide-code/shared';
import type { AniMemberFull } from '@anime-ide-code/shared';

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
    <div className="mt-8">
      <h2 className="text-xl font-extrabold text-text mb-4">Над озвучкой работали</h2>
      <div className="flex flex-col gap-3">
        {byRole.map(([role, names]) => (
          <div key={role} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <div className="text-text-dim text-xs font-bold uppercase tracking-wider sm:w-40 shrink-0">
              {role}
            </div>
            <div className="text-text text-sm flex flex-wrap gap-x-2 gap-y-1">
              {names.map((n, i) => (
                <span key={`${n}-${i}`}>
                  {n}
                  {i < names.length - 1 ? <span className="text-text-muted"> ·</span> : null}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
