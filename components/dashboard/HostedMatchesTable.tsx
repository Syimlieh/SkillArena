"use client";

import Link from "next/link";
import { Match } from "@/types/match.types";
import { Badge } from "@/components/ui/Badge";
import { buildMatchDetailRoute } from "@/lib/routes";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchType } from "@/enums/MatchType.enum";
import { MatchStatus } from "@/enums/MatchStatus.enum";

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

const formatStatus = (status?: MatchStatus) => {
  if (!status) return "Unknown";
  if (status === MatchStatus.AWAITING_RESULTS) return "Awaiting Results";
  return status.toLowerCase().replace(/_/g, " ");
};

const mapTone = (map?: MatchMap) => (map === MatchMap.LIVIK ? "warning" : "success");
const typeTone = (type?: MatchType) => (type === MatchType.COMMUNITY ? "neutral" : "success");

export const HostedMatchesTable = ({ matches }: Props) => {
  if (!matches.length) return null;
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="mb-3 text-lg font-semibold text-[var(--text-primary)]">Hosted Matches</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-[var(--text-primary)]">
          <thead className="text-xs uppercase text-[var(--text-secondary)]">
            <tr>
              <th className="pb-2 pr-4">Match</th>
              <th className="pb-2 pr-4">Type</th>
              <th className="pb-2 pr-4">Map</th>
              <th className="pb-2 pr-4">Start</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Registered</th>
              <th className="pb-2 pr-4">Pending Results</th>
              <th className="pb-2 pr-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {matches.map((match) => (
              <tr key={match._id?.toString() ?? match.matchId}>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[var(--text-primary)]">{match.title}</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">{match.matchId}</span>
                  </div>
                </td>
                <td className="py-2 pr-4">
                  <Badge tone={typeTone(match.type)}>{match.type ?? MatchType.OFFICIAL}</Badge>
                </td>
                <td className="py-2 pr-4">
                  <Badge tone={mapTone(match.map)}>{match.map}</Badge>
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">{formatTime(match.startTime)}</td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  <span className="font-semibold text-[var(--accent-primary)]">{formatStatus(match.status)}</span>
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">{match.registrationCount ?? 0}</td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">{match.pendingResultCount ?? 0}</td>
                <td className="py-2 pr-4 text-right">
                  <Link
                    href={buildMatchDetailRoute(match.slug ?? match.matchId)}
                    className="text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HostedMatchesTable;
