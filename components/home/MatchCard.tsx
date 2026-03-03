import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { HomeMatch } from "@/lib/home.content";

interface Props {
  match: HomeMatch;
}

export const MatchCard = ({ match }: Props) => (
  <div className="glass-panel glow-hover flex flex-col justify-between rounded-2xl p-4">
    <div className="flex items-center justify-between">
      <Badge tone="success" className="text-[10px]">{match.map}</Badge>
      <Badge tone="neutral" className="text-[10px]">{match.status}</Badge>
    </div>
    <div className="mt-3 space-y-2">
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{match.title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">{match.startTime}</p>
      <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
        <span>Entry: {match.entryFee}</span>
        <span>Prize: {match.prizePool}</span>
      </div>
    </div>
    <div className="mt-4">
      <Link
        href={match.href ?? `/matches/${match.matchId ?? match.id}`}
        className="inline-flex items-center justify-center rounded-xl border border-[var(--panel-border)] bg-[var(--bg-secondary)]/72 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)] hover:shadow-[0_0_20px_rgba(49,255,225,0.2)]"
      >
        View Details
      </Link>
    </div>
  </div>
);

export default MatchCard;
