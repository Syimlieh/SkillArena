import { Match } from "@/types/match.types";
import { MatchStatus } from "@/enums/MatchStatus.enum";

const formatTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));

const statusLabel = (status: MatchStatus) => {
  if (status === MatchStatus.AWAITING_RESULTS) return "Awaiting Results";
  return status.toLowerCase().replace(/_/g, " ");
};

export const MatchDetailsCard = ({ match }: { match: Match }) => (
  <div className="glass-panel rounded-2xl p-4">
    <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 shadow-sm">
          <div className="text-xs uppercase text-[var(--text-secondary)]">Start Time</div>
          <div className="text-lg font-semibold">{formatTime(match.startTime)}</div>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 shadow-sm">
          <div className="text-xs uppercase text-[var(--text-secondary)]">Entry Fee</div>
          <div className="text-lg font-semibold">₹{match.entryFee}</div>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 shadow-sm">
          <div className="text-xs uppercase text-[var(--text-secondary)]">Registered Users</div>
          <div className="text-lg font-semibold">{`${match.registrationCount ?? 0}/${match.maxSlots}`}</div>
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 shadow-sm">
        <div className="text-xs uppercase text-[var(--text-secondary)]">Prize Breakdown</div>
        <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="font-semibold text-[var(--text-primary)]">1st</div>
            <div className="text-[var(--text-secondary)]">₹{match?.prizeBreakdown?.first}</div>
          </div>
          <div>
            <div className="font-semibold text-[var(--text-primary)]">2nd</div>
            <div className="text-[var(--text-secondary)]">₹{match?.prizeBreakdown?.second}</div>
          </div>
          <div>
            <div className="font-semibold text-[var(--text-primary)]">3rd</div>
            <div className="text-[var(--text-secondary)]">₹{match?.prizeBreakdown?.third}</div>
          </div>
        </div>
      </div>
  </div>
);

export default MatchDetailsCard;
