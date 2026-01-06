"use client";

import { DashboardScrim } from "@/types/dashboard.types";
import { Badge } from "@/components/ui/Badge";
import { ScrimMap } from "@/enums/ScrimMap.enum";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";

interface Props {
  scrims: DashboardScrim[];
}

const formatTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));

const mapTone = (map?: ScrimMap): "warning" | "success" =>
  map === ScrimMap.LIVIK ? "warning" : "success";

export const UpcomingMatches = ({ scrims }: Props) => (
  <div className="space-y-3">
    <div className="text-sm uppercase text-[var(--primary)]">Upcoming Matches</div>
    <div className="grid gap-3 md:grid-cols-2">
      {scrims.map((scrim) => (
        <div key={scrim.slug ?? scrim._id?.toString() ?? scrim.title} className="glass-panel rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-white">{scrim.title}</div>
            <Badge tone={mapTone(scrim.map)}>Map: {scrim.map ?? ScrimMap.ERANGEL}</Badge>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
            <span>Start: {formatTime(scrim.startTime)}</span>
            <span className="text-[var(--primary)] font-semibold">CONFIRMED</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">Status: {scrim.status ?? ScrimStatus.UPCOMING}</div>
        </div>
      ))}
    </div>
  </div>
);
