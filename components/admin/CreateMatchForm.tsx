"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MatchPreviewCard } from "@/components/admin/MatchPreviewCard";
import { Button } from "@/components/ui/Button";
import { MATCH_DEFAULTS, API_ROUTES } from "@/lib/constants";
import { PrizeBreakdown } from "@/types/match.types";
import { matchSchema } from "@/modules/matches/match.validator";

interface Props {
  onCreated?: () => void;
}

interface FormState {
  map: MatchMap;
  startDate: string;
  startTime: string;
  entryFee: number;
  maxSlots: number;
  prizeBreakdown: PrizeBreakdown;
}

const initialState: FormState = {
  map: MatchMap.ERANGEL,
  startDate: "",
  startTime: "",
  entryFee: MATCH_DEFAULTS.entryFee,
  maxSlots: MATCH_DEFAULTS.maxSlots,
  prizeBreakdown: { ...MATCH_DEFAULTS.prizes },
};

export const CreateMatchForm = ({ onCreated }: Props) => {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [createdMatchId, setCreatedMatchId] = useState<string | undefined>();

  const prizePool = useMemo(
    () => form.prizeBreakdown.first + form.prizeBreakdown.second + form.prizeBreakdown.third,
    [form.prizeBreakdown]
  );

  console.log("Render CreateMatchForm with form state:");

  // Avoid hydration drift: set a deterministic client-side default start time after mount
  useEffect(() => {
    if (!form.startDate || !form.startTime) {
      const now = new Date();
      const rounded = new Date(Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)); // next 15 min
      const dateStr = rounded.toISOString().slice(0, 10);
      const timeStr = rounded.toISOString().slice(11, 16);
      setForm((prev) => ({ ...prev, startDate: dateStr, startTime: timeStr }));
    }
  }, [form.startDate, form.startTime]);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrizeChange = (key: keyof PrizeBreakdown, value: number) => {
    setForm((prev) => ({
      ...prev,
      prizeBreakdown: { ...prev.prizeBreakdown, [key]: value },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    console.log("Submitting form...");
    event.preventDefault();
    setLoading(true);
    setStatusMessage(undefined);
    setCreatedMatchId(undefined);

    const payload = {
      map: form.map,
      startDate: form.startDate,
      startTime: form.startTime,
      entryFee: form.entryFee,
      maxSlots: form.maxSlots,
      prizeBreakdown: form.prizeBreakdown,
      status: MatchStatus.UPCOMING,
    };

    console.log("Submitting form data:", payload);
    const parsed = matchSchema.safeParse(payload);
    console.log("Parsed form data:", parsed);
    if (!parsed.success) {
      setLoading(false);
      setStatusMessage("Invalid form data. Please check inputs.");
      return;
    }

    try {
      const res = await fetch(API_ROUTES.adminMatches, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        const msg =
          data?.error?.message || data?.error || "Failed to create match. Ensure you are an admin.";
        setStatusMessage(msg);
        return;
      }
      setCreatedMatchId(data?.data?.match?.matchId ?? data?.match?.matchId);
      setStatusMessage("Match created successfully.");
      setForm(initialState);
      onCreated?.();
      router.refresh();
      router.push("/dashboard/admin");
    } catch (error) {
      setStatusMessage("Network error while creating match.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Create Upcoming Match</h2>
            <p className="text-sm text-slate-400">Admins can schedule new BGMI scrims.</p>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Match"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-slate-200">Map</span>
            <select
              value={form.map}
              onChange={(e) => handleChange("map", e.target.value as MatchMap)}
              className="w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-3 py-2 text-white"
            >
              {Object.values(MatchMap).map((map) => (
                <option key={map} value={map}>
                  {map.charAt(0) + map.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-slate-200">Start Date</span>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-3 py-2 text-white"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-slate-200">Start Time</span>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-3 py-2 text-white"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm">
            <span className="text-slate-200">Entry Fee</span>
            <input
              type="number"
              value={form.entryFee}
              onChange={(e) => handleChange("entryFee", Number(e.target.value))}
              className="w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-3 py-2 text-white"
              min={1}
              max={500}
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-200">Max Slots</span>
            <input
              type="number"
              value={form.maxSlots}
              onChange={(e) => handleChange("maxSlots", Number(e.target.value))}
              className="w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-3 py-2 text-white"
              min={1}
              max={MATCH_DEFAULTS.maxSlots}
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-200">Prize Pool (auto)</span>
            <input
              type="number"
              value={prizePool}
              readOnly
              className="w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-3 py-2 text-white opacity-70"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(["first", "second", "third"] as (keyof PrizeBreakdown)[]).map((key) => (
            <label key={key} className="space-y-2 text-sm">
              <span className="text-slate-200 capitalize">{key} Prize</span>
              <input
                type="number"
                value={form.prizeBreakdown[key]}
                onChange={(e) => handlePrizeChange(key, Number(e.target.value))}
                className="w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-3 py-2 text-white"
                min={0}
              />
            </label>
          ))}
        </div>

        {statusMessage && <p className="text-sm text-red-400">{statusMessage}</p>}
      </form>

      <MatchPreviewCard
        map={form.map}
        startDate={form.startDate}
        startTime={form.startTime}
        entryFee={form.entryFee}
        maxSlots={form.maxSlots}
        prizeBreakdown={form.prizeBreakdown}
        matchId={createdMatchId}
      />
    </div>
  );
};
