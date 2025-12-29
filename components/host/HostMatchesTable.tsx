"use client";

import { useEffect, useMemo, useState } from "react";
import { Match } from "@/types/match.types";
import { API_ROUTES, MATCH_DEFAULTS } from "@/lib/constants";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MatchType } from "@/enums/MatchType.enum";

const formatTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));

const typeLabel = (type?: MatchType) => type ?? MatchType.OFFICIAL;

export const HostMatchesTable = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch(API_ROUTES.hostMatches, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setError(data?.error?.message || data?.error || "Failed to load matches");
        return;
      }
      setMatches(data?.data?.matches ?? data?.matches ?? []);
    } catch {
      setError("Network error while loading matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const hasRows = useMemo(() => matches.length > 0, [matches.length]);

  return (
    <div className="space-y-3">
      <div className="text-sm uppercase text-[var(--primary)]">Your Matches</div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <p className="text-sm text-slate-400">Loading...</p>}
      {hasRows ? (
        <div className="overflow-x-auto rounded-2xl border border-[#0f172a] bg-[#0a0f17]">
          <table className="w-full text-left text-sm text-slate-200">
            <thead>
              <tr className="border-b border-[#0f172a] text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Map</th>
                <th className="px-4 py-3 font-semibold">Start</th>
                <th className="px-4 py-3 font-semibold">Entry</th>
                <th className="px-4 py-3 font-semibold">Prize Pool</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f172a]">
              {matches.map((match) => (
                <tr key={match._id?.toString() ?? match.matchId} className="align-top">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">{match.title}</span>
                      <span className="text-xs text-slate-500">ID: {match.matchId}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-200">{typeLabel(match.type)}</td>
                  <td className="px-4 py-3 text-xs text-slate-200">{match.map}</td>
                  <td className="px-4 py-3 text-xs text-slate-200">{formatTime(match.startTime)}</td>
                  <td className="px-4 py-3 text-xs text-slate-200">₹{match.entryFee ?? MATCH_DEFAULTS.entryFee}</td>
                  <td className="px-4 py-3 text-xs text-slate-200">₹{match.prizePool ?? MATCH_DEFAULTS.prizes.first}</td>
                  <td className="px-4 py-3 text-xs text-[var(--primary)] font-semibold">{match.status ?? MatchStatus.UPCOMING}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-sm text-slate-400">No matches created yet.</p>
      )}
    </div>
  );
};
