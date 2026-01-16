"use client";

import Link from "next/link";
import { RegisteredMatch } from "@/types/dashboard.types";
import { Badge } from "@/components/ui/Badge";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchType } from "@/enums/MatchType.enum";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";
import { buildMatchDetailRoute } from "@/lib/routes";
import { MatchStatus } from "@/enums/MatchStatus.enum";

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
const typeTone = (type?: MatchType) => (type === MatchType.COMMUNITY ? "neutral" : "success");
const formatMatchStatus = (status?: MatchStatus) => {
  if (!status) return "Unknown";
  if (status === MatchStatus.AWAITING_RESULTS) return "Awaiting Results";
  return status.toLowerCase().replace(/_/g, " ");
};

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
      <div className="text-sm uppercase text-[var(--text-secondary)]">My Matches</div>
      <div className="grid gap-3 md:grid-cols-2">
        {matches.map((item) => {
          const { match, registrationStatus, paymentStatus } = item;
          const label = statusLabel(registrationStatus, paymentStatus);
          return (
            <div key={match.matchId} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-semibold text-[var(--text-primary)]">{match.title}</div>
                  <Badge tone={typeTone(match.type)}>{match.type ?? MatchType.OFFICIAL}</Badge>
                </div>
                <Badge tone={mapTone(match.map)}>{match.map}</Badge>
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Match ID: {match.matchId}</div>
              <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                <span>Start: {formatTime(match.startTime)}</span>
                <span className="text-[var(--accent-primary)] font-semibold">{formatMatchStatus(match.status)}</span>
              </div>
              <div className="text-sm text-[var(--text-secondary)]">Entry: ₹{match.entryFee} • Prize Pool: ₹{match.prizePool}</div>
              <div className="flex items-center justify-between">
                <Badge tone={label.tone}>{label.text}</Badge>
                <Link href={buildMatchDetailRoute(match.slug ?? match.matchId)} className="text-xs text-[var(--accent-primary)] hover:underline">
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
