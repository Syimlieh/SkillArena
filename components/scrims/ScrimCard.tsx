"use client";

import { Scrim } from "@/types/scrim.types";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useMemo } from "react";

interface Props {
  scrim: Scrim;
  onJoin?: (scrimId: string) => void;
}

const statusCopy: Record<ScrimStatus, string> = {
  [ScrimStatus.UPCOMING]: "Join Now",
  [ScrimStatus.FULL]: "Full",
  [ScrimStatus.COMPLETED]: "Completed",
  [ScrimStatus.CANCELLED]: "Cancelled",
};

export const ScrimCard = ({ scrim, onJoin }: Props) => {
  const isJoinable = scrim.status === ScrimStatus.UPCOMING;
  const startTimeLabel = useMemo(() => {
    const date = new Date(scrim.startTime);
    // Explicit timezone avoids server/client mismatch during hydration
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
  }, [scrim.startTime]);

  return (
    <div className="glass-panel glow-hover flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-white">{scrim.title}</div>
        <Badge tone={scrim.status === ScrimStatus.FULL ? "warning" : "success"}>{scrim.status}</Badge>
      </div>
      <div className="text-sm text-slate-300">Entry ₹{scrim.entryFee}</div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Prize Pool ₹{scrim.prizePool}</span>
        <span>Starts {startTimeLabel}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Slots: {scrim.maxSlots}</span>
        {scrim.roomId && <span>Room: {scrim.roomId}</span>}
      </div>
      <Button
        disabled={!isJoinable}
        variant={isJoinable ? "primary" : "secondary"}
        onClick={() => isJoinable && onJoin?.(scrim._id?.toString() || "")}
        className={!isJoinable ? "opacity-60" : ""}
      >
        {statusCopy[scrim.status]}
      </Button>
    </div>
  );
};
