import Link from "next/link";
import { Match } from "@/types/match.types";
import { Badge } from "@/components/ui/Badge";
import { MatchStatus } from "@/enums/MatchStatus.enum";
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

const mapTone = (map?: MatchMap) => (map === MatchMap.LIVIK ? "warning" : "success") as const;
const typeTone = (type?: MatchType) => (type === MatchType.COMMUNITY ? "neutral" : "success");

export const UpcomingMatchesTable = ({ matches }: Props) => (
  <div className="glass-panel rounded-2xl p-4">
    <div className="mb-3 text-sm uppercase text-[var(--primary)]">Upcoming Matches</div>
    <div className="mb-3 flex gap-2 text-xs text-[var(--text-secondary)]">
      <span className="rounded-full border border-[var(--border-subtle)] px-2 py-1">Showing: Upcoming + Ongoing</span>
      <span className="rounded-full border border-[var(--border-subtle)] px-2 py-1">Total: {matches.length}</span>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-[var(--text-primary)]">
        <thead className="text-xs uppercase text-[var(--text-secondary)]">
          <tr>
            <th className="pb-2 pr-4">Match ID</th>
            <th className="pb-2 pr-4">Type</th>
            <th className="pb-2 pr-4">Map</th>
            <th className="pb-2 pr-4">Date / Time</th>
            <th className="pb-2 pr-4">Slots</th>
            <th className="pb-2 pr-4">Entry Fee</th>
            <th className="pb-2 pr-4">Prize Pool</th>
            <th className="pb-2 pr-4">Review</th>
            <th className="pb-2 pr-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {matches.map((match) => {
            const href = `/matches/${match.slug ?? match.matchId.toLowerCase()}`;
            const key = match._id?.toString() ?? match.matchId;
            return (
              <tr key={key} className="transition hover:bg-[var(--bg-secondary)]/60">
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card-bg)]">
                    {match.matchId}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    <Badge tone={typeTone(match.type)}>{match.type ?? MatchType.OFFICIAL}</Badge>
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    <Badge tone={mapTone(match.map)}>{match.map}</Badge>
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    {formatTime(match.startTime)}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    {(match.registrationCount ?? 0) + "/" + match.maxSlots}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">₹{match.entryFee}</Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">₹{match.prizePool}</Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    {match.pendingResultCount && match.pendingResultCount > 0 ? (
                      <Badge tone="warning">{match.pendingResultCount} pending</Badge>
                    ) : (
                      <span className="text-[var(--text-secondary)] text-xs">None</span>
                    )}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    <Badge tone={match.status === MatchStatus.ONGOING ? "warning" : "success"}>
                      {match.status === MatchStatus.ONGOING ? "Ongoing" : "Upcoming"}
                    </Badge>
                  </Link>
                </td>
              </tr>
            );
          })}
          {matches.length === 0 && (
            <tr>
              <td className="py-3 text-[var(--text-secondary)]" colSpan={8}>
                No upcoming matches yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
