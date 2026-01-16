"use client";

import Link from "next/link";
import { Match } from "@/types/match.types";
import { Badge } from "@/components/ui/Badge";
import { buildMatchDetailRoute } from "@/lib/routes";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchType } from "@/enums/MatchType.enum";

interface Props {
  matches: Match[];
}

const formatTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));

const mapTone = (map?: MatchMap) => (map === MatchMap.LIVIK ? "warning" : "success");
const typeTone = (type?: MatchType) => (type === MatchType.COMMUNITY ? "neutral" : "success");

export const HostedMatches = ({ matches }: Props) => {
  if (!matches.length) return null;
  return (
    <div className="space-y-3">
      <div className="text-sm uppercase text-[var(--text-secondary)]">Hosted Matches</div>
      <div className="grid gap-3 md:grid-cols-2">
        {matches.map((match) => (
          <Link
            key={match._id?.toString() ?? match.matchId}
            href={buildMatchDetailRoute(match.slug ?? match.matchId)}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 text-[var(--text-primary)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-lg font-semibold">{match.title}</div>
                <Badge tone={typeTone(match.type)}>{match.type ?? MatchType.OFFICIAL}</Badge>
              </div>
              <Badge tone={mapTone(match.map)}>{match.map}</Badge>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-[var(--text-secondary)]">
              <span>Start: {formatTime(match.startTime)}</span>
              <span className="text-[var(--accent-primary)] font-semibold">{match.status}</span>
            </div>
            <div className="mt-1 text-xs text-[var(--text-secondary)]">
              Entry ₹{match.entryFee} • Prize Pool ₹{match.prizePool}
            </div>
            <div className="mt-2 text-xs font-semibold text-[var(--accent-primary)]">Hosted by you</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HostedMatches;
