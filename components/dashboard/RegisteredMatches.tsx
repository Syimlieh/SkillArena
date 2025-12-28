"use client";

import Link from "next/link";
import { RegisteredMatch } from "@/types/dashboard.types";
import { Badge } from "@/components/ui/Badge";
import { MatchMap } from "@/enums/MatchMap.enum";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";
import { buildMatchDetailRoute } from "@/lib/routes";

interface Props {
  matches: RegisteredMatch[];
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

const statusLabel = (reg: RegistrationStatus, pay: PaymentStatus) => {
  if (reg === RegistrationStatus.PENDING_PAYMENT) return { text: "Awaiting Payment", tone: "warning" as const };
  if (reg === RegistrationStatus.CONFIRMED) return { text: "Registered", tone: "success" as const };
  if (reg === RegistrationStatus.CANCELLED) return { text: "Cancelled", tone: "neutral" as const };
  return { text: "Pending", tone: "neutral" as const };
};

export const RegisteredMatches = ({ matches }: Props) => {
  if (!matches.length) return null;
  return (
    <div className="space-y-3">
      <div className="text-sm uppercase text-[var(--primary)]">My Matches</div>
      <div className="grid gap-3 md:grid-cols-2">
        {matches.map((item) => {
          const { match, registrationStatus, paymentStatus } = item;
          const label = statusLabel(registrationStatus, paymentStatus);
          return (
            <div key={match.matchId} className="glass-panel rounded-2xl p-4 text-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{match.title}</div>
                <Badge tone={mapTone(match.map)}>{match.map}</Badge>
              </div>
              <div className="text-xs text-slate-400">Match ID: {match.matchId}</div>
              <div className="text-sm text-slate-300">Start: {formatTime(match.startTime)}</div>
              <div className="text-sm text-slate-300">Entry: ₹{match.entryFee} • Prize Pool: ₹{match.prizePool}</div>
              <div className="flex items-center justify-between">
                <Badge tone={label.tone}>{label.text}</Badge>
                <Link href={buildMatchDetailRoute(match.slug ?? match.matchId)} className="text-xs text-[var(--primary)] hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
