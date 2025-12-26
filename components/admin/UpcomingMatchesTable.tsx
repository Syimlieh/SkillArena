import { Match } from "@/types/match.types";
import { Badge } from "@/components/ui/Badge";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MatchMap } from "@/enums/MatchMap.enum";

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

export const UpcomingMatchesTable = ({ matches }: Props) => (
  <div className="glass-panel rounded-2xl p-4">
    <div className="mb-3 text-sm uppercase text-[var(--primary)]">Upcoming Matches</div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="text-xs uppercase text-slate-400">
          <tr>
            <th className="pb-2 pr-4">Match ID</th>
            <th className="pb-2 pr-4">Map</th>
            <th className="pb-2 pr-4">Date / Time</th>
            <th className="pb-2 pr-4">Slots</th>
            <th className="pb-2 pr-4">Entry Fee</th>
            <th className="pb-2 pr-4">Prize Pool</th>
            <th className="pb-2 pr-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#0f172a]">
          {matches.map((match) => (
            <tr key={match._id?.toString() ?? match.matchId}>
              <td className="py-2 pr-4 font-semibold">{match.matchId}</td>
              <td className="py-2 pr-4">
                <Badge tone={mapTone(match.map)}>{match.map}</Badge>
              </td>
              <td className="py-2 pr-4">{formatTime(match.startTime)}</td>
              <td className="py-2 pr-4">{`0/${match.maxSlots}`}</td>
              <td className="py-2 pr-4">₹{match.entryFee}</td>
              <td className="py-2 pr-4">₹{match.prizePool}</td>
              <td className="py-2 pr-4">
                <Badge tone="success">{MatchStatus.UPCOMING}</Badge>
              </td>
            </tr>
          ))}
          {matches.length === 0 && (
            <tr>
              <td className="py-3 text-slate-400" colSpan={7}>
                No upcoming matches yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
