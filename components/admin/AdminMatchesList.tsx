"use client";

import { useEffect, useState } from "react";
import { Match } from "@/types/match.types";
import { API_ROUTES, MATCH_DEFAULTS } from "@/lib/constants";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MatchType } from "@/enums/MatchType.enum";
import { Badge } from "@/components/ui/Badge";

const formatTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));

const typeTone = (type?: MatchType) => (type === MatchType.COMMUNITY ? "neutral" : "success");

export const AdminMatchesList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | undefined>();

  const load = async () => {
    try {
      const res = await fetch(`${API_ROUTES.adminMatches}?status=${MatchStatus.UPCOMING}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setError(data?.error?.message || data?.error || "Failed to load matches");
        return;
      }
      const list: Match[] = data?.data?.matches ?? data?.matches ?? [];
      setMatches(list.map((m) => ({ ...m, type: m.type ?? MatchType.OFFICIAL })));
    } catch {
      setError("Network error while loading matches");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3">
      <div className="text-sm uppercase text-[var(--primary)]">Upcoming Matches</div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {matches.map((match) => (
          <div key={match._id?.toString() ?? match.matchId} className="glass-panel rounded-2xl p-4 text-white space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-lg font-semibold">{match.title}</div>
                <Badge tone={typeTone(match.type)}>{match.type ?? MatchType.OFFICIAL}</Badge>
              </div>
              <Badge tone={match.map === MatchMap.LIVIK ? "warning" : "success"}>{match.map}</Badge>
            </div>
            <div className="text-sm text-slate-300">Start: {formatTime(match.startTime)}</div>
            <div className="text-sm text-slate-300">Match ID: {match.matchId}</div>
            <div className="text-xs text-slate-400">Type: {match.type ?? MatchType.OFFICIAL}</div>
            <div className="text-xs text-slate-400">
              Entry ₹{match.entryFee ?? MATCH_DEFAULTS.entryFee} • Slots {match.maxSlots}
            </div>
          </div>
        ))}
        {matches.length === 0 && !error && (
          <div className="text-sm text-slate-400">No upcoming matches yet.</div>
        )}
      </div>
    </div>
  );
};
