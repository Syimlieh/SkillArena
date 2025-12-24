"use client";

import { Scrim } from "@/types/scrim.types";
import { ScrimCard } from "@/components/scrims/ScrimCard";

interface Props {
  scrims: Scrim[];
  onJoin?: (scrimId: string) => void;
}

export const ScrimList = ({ scrims, onJoin }: Props) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {scrims.map((scrim) => (
      <ScrimCard key={scrim._id?.toString() || scrim.title} scrim={scrim} onJoin={onJoin} />
    ))}
  </div>
);
