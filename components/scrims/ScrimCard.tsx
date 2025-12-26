"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Scrim } from "@/types/scrim.types";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { AuthStatus } from "@/enums/AuthStatus.enum";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { buildScrimDetailRoute } from "@/lib/routes";
import { rememberPostLoginRedirect } from "@/lib/auth";
import { handleAuthRedirect } from "@/modules/navigation/navigation.service";
import { resolveScrimSlug } from "@/modules/scrims/scrim.selector";

interface Props {
  scrim: Scrim;
}

const statusCopy: Record<ScrimStatus, string> = {
  [ScrimStatus.UPCOMING]: "Join Now",
  [ScrimStatus.ONGOING]: "Ongoing",
  [ScrimStatus.COMPLETED]: "Completed",
  [ScrimStatus.FULL]: "Full",
  [ScrimStatus.CANCELLED]: "Cancelled",
};

const getAvailableSlots = (scrim: Scrim) => {
  if (typeof scrim.availableSlots === "number") return scrim.availableSlots;
  return scrim.maxSlots;
};

export const ScrimCard = ({ scrim }: Props) => {
  const router = useRouter();
  const { state } = useAuth();
  const isAuthenticated = state.status === AuthStatus.AUTHENTICATED && !!state.user;

  const isJoinable =
    scrim.status === ScrimStatus.UPCOMING && typeof getAvailableSlots(scrim) === "number"
      ? getAvailableSlots(scrim) > 0
      : scrim.status === ScrimStatus.UPCOMING;

  const startTimeLabel = useMemo(() => {
    const date = new Date(scrim.startTime);
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
  }, [scrim.startTime]);

  const handleJoin = useCallback(() => {
    const slug = resolveScrimSlug(scrim);
    if (!slug) return;
    const target = buildScrimDetailRoute(slug);
    if (!isAuthenticated) rememberPostLoginRedirect(target);
    handleAuthRedirect(router, isAuthenticated, target);
  }, [isAuthenticated, router, scrim]);

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
        onClick={handleJoin}
        className={!isJoinable ? "opacity-60" : ""}
      >
        {statusCopy[scrim.status] ?? "Join"}
      </Button>
    </div>
  );
};
