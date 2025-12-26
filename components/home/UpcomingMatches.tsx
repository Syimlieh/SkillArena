"use client";

import { ScrimList } from "@/components/scrims/ScrimList";
import { Scrim } from "@/types/scrim.types";

interface Props {
  scrims: Scrim[];
}

export const UpcomingMatches = ({ scrims }: Props) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="text-sm uppercase text-[var(--primary)]">Upcoming Matches</div>
    </div>
    <ScrimList scrims={scrims} />
  </section>
);
