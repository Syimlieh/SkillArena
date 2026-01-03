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
      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-[var(--text-secondary)]">Loading...</p>}
      {hasRows ? (
        <div className="glass-panel overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm text-[var(--text-primary)]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Map</th>
                <th className="px-4 py-3 font-semibold">Start</th>
                <th className="px-4 py-3 font-semibold">Slots</th>
                <th className="px-4 py-3 font-semibold">Entry</th>
                <th className="px-4 py-3 font-semibold">Prize Pool</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {matches.map((match) => (
                <tr key={match._id?.toString() ?? match.matchId} className="align-top">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--text-primary)]">{match.title}</span>
                      <span className="text-xs text-[var(--text-secondary)]">ID: {match.matchId}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{typeLabel(match.type)}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{match.map}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{formatTime(match.startTime)}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                    {(match.registrationCount ?? 0) + "/" + match.maxSlots}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                    ₹{match.entryFee ?? MATCH_DEFAULTS.entryFee}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                    ₹{match.prizePool ?? MATCH_DEFAULTS.prizes.first}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--primary)] font-semibold">{match.status ?? MatchStatus.UPCOMING}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-sm text-[var(--text-secondary)]">No matches created yet.</p>
      )}
    </div>
  );
};
