import { Badge } from "@/components/ui/Badge";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MatchType } from "@/enums/MatchType.enum";
import { Match } from "@/types/match.types";

const formatStatus = (status: MatchStatus) => {
  if (status === MatchStatus.AWAITING_RESULTS) return "Awaiting Results";
  return status.toLowerCase().replace(/_/g, " ");
};

export const MatchHeader = ({ match }: { match: Match }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-3xl font-black text-[var(--text-primary)]">{match.title}</h1>
      <p className="text-sm text-[var(--text-secondary)]">Match ID: {match.matchId}</p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone={match.map === MatchMap.LIVIK ? "warning" : "success"} className="whitespace-nowrap px-4 text-[11px]">
        Map: {match.map}
      </Badge>
      <Badge tone="neutral" className="whitespace-nowrap px-4 text-[11px]">
        {match.type === MatchType.COMMUNITY ? "Community" : "Official"}
      </Badge>
      <Badge tone="neutral" className="whitespace-nowrap px-4 text-[11px]">
        {formatStatus(match.status)}
      </Badge>
    </div>
  </div>
);

export default MatchHeader;
