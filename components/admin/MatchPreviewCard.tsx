"use client";

import { useMemo } from "react";
import { MatchMap } from "@/enums/MatchMap.enum";
import { Badge } from "@/components/ui/Badge";
import { MATCH_DEFAULTS } from "@/lib/constants";
import { PrizeBreakdown } from "@/types/match.types";

interface Props {
  map: MatchMap;
  startDate: string;
  startTime: string;
  entryFee: number;
  maxSlots: number;
  prizeBreakdown: PrizeBreakdown;
  matchId?: string;
}

const formatTime = (date: string | null, time: string | null) => {
  if (!date || !time) return "Set start time";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${date}T${time}:00Z`));
};

export const MatchPreviewCard = ({
  map,
  startDate,
  startTime,
  entryFee,
  maxSlots,
  prizeBreakdown,
  matchId,
}: Props) => {
  const prizePool = useMemo(
    () => prizeBreakdown.first + prizeBreakdown.second + prizeBreakdown.third,
    [prizeBreakdown]
  );

  return (
    <div className="glass-panel rounded-2xl p-4 space-y-3 text-[var(--text-primary)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-[var(--primary)]">Preview</div>
          <div className="text-lg font-bold">BGMI Scrim</div>
          {matchId && <div className="text-xs text-[var(--text-secondary)]">Match ID: {matchId}</div>}
        </div>
        <Badge tone={map === MatchMap.LIVIK ? "warning" : "success"}>Map: {map}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-[var(--text-primary)]">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3">
          <div className="text-xs uppercase text-[var(--primary)]">Start</div>
          <div className="font-semibold">{formatTime(startDate, startTime)}</div>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3">
          <div className="text-xs uppercase text-[var(--primary)]">Slots</div>
          <div className="font-semibold">{maxSlots}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-xs uppercase text-[var(--primary)]">Entry</div>
          <div className="font-semibold">₹{entryFee}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-[var(--primary)]">Prize Pool</div>
          <div className="font-semibold">₹{prizePool || MATCH_DEFAULTS.prizes.first + MATCH_DEFAULTS.prizes.second + MATCH_DEFAULTS.prizes.third}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-[var(--primary)]">Format</div>
          <div className="font-semibold">SkillArena BGMI</div>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm">
        <div className="text-xs uppercase text-[var(--primary)] mb-1">Prizes</div>
        <div className="flex gap-4 text-[var(--text-secondary)]">
          <span>1st ₹{prizeBreakdown.first}</span>
          <span>2nd ₹{prizeBreakdown.second}</span>
          <span>3rd ₹{prizeBreakdown.third}</span>
        </div>
      </div>
    </div>
  );
};
