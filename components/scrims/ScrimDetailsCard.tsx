"use client";

import { useState, useMemo } from "react";
import { Scrim } from "@/types/scrim.types";
import { ScrimMap } from "@/enums/ScrimMap.enum";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Props {
  scrim: Scrim;
}

const formatTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));

export const ScrimDetailsCard = ({ scrim }: Props) => {
  const [message, setMessage] = useState<string | undefined>();

  const slotsRemaining = useMemo(() => {
    if (typeof scrim.availableSlots === "number") return scrim.availableSlots;
    return scrim.maxSlots;
  }, [scrim.availableSlots, scrim.maxSlots]);

  const handleConfirm = () => {
    // Placeholder: payment flow is launched only after explicit confirmation
    setMessage("Proceed to payment flow (coming soon).");
  };

  return (
    <div className="glass-panel rounded-2xl p-6 text-white space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">{scrim.title}</h1>
          <p className="text-sm text-slate-400">Entry Fee: ₹80</p>
        </div>
        <Badge tone={scrim.map === ScrimMap.LIVIK ? "warning" : "success"}>Map: {scrim.map ?? ScrimMap.ERANGEL}</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-2 text-slate-200">
        <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-3">
          <div className="text-xs uppercase text-[var(--primary)]">Start Time</div>
          <div className="text-lg font-semibold">{formatTime(scrim.startTime)}</div>
        </div>
        <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-3">
          <div className="text-xs uppercase text-[var(--primary)]">Slots Remaining</div>
          <div className="text-lg font-semibold">{slotsRemaining}</div>
        </div>
      </div>
      <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-4">
        <div className="text-xs uppercase text-[var(--primary)]">Prize Breakdown</div>
        <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="font-semibold text-white">1st</div>
            <div className="text-slate-300">₹1370</div>
          </div>
          <div>
            <div className="font-semibold text-white">2nd</div>
            <div className="text-slate-300">₹150</div>
          </div>
          <div>
            <div className="font-semibold text-white">3rd</div>
            <div className="text-slate-300">₹80</div>
          </div>
        </div>
      </div>
      <Button onClick={handleConfirm} className="w-full justify-center">
        Confirm &amp; Pay ₹80
      </Button>
      {message && <p className="text-sm text-slate-300">{message}</p>}
    </div>
  );
};
