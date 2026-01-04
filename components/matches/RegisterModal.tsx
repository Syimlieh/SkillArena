"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { Match } from "@/types/match.types";
import { useAuth } from "@/context/AuthContext";

interface Props {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
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

const RegisterModal = ({ match, isOpen, onClose }: Props) => {
  const router = useRouter();
  const { state } = useAuth();
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [teamName, setTeamName] = useState("");

  const defaultTeamName = state.user?.name ?? "";

  useEffect(() => {
    if (isOpen && !teamName && defaultTeamName) {
      setTeamName("");
    }
  }, [isOpen, defaultTeamName, teamName]);

  const handleProceed = async () => {
    if (!agree) {
      setMessage("Please agree to the rules and fair-play policy.");
      return;
    }
    if (!teamName.trim()) {
      setMessage("Please add a team name.");
      return;
    }
    setLoading(true);
    setMessage(undefined);
    try {
      const res = await fetch(`/api/matches/${encodeURIComponent(match.matchId)}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: teamName.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setMessage(data?.error?.message || data?.error || "Unable to register.");
        setLoading(false);
        return;
      }
      setMessage("Registration created. Proceed to payment (coming soon).");
      setLoading(false);
      onClose();
      router.push("/dashboard");
    } catch {
      setMessage("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Registration" disableBackdropClose>
      <div className="space-y-3 text-white">
        <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-3 text-sm">
          <div className="text-xs uppercase text-[var(--primary)]">Match</div>
          <div className="font-semibold">{match.title}</div>
          <div className="text-slate-300">ID: {match.matchId}</div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-slate-200">
          <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-3">
            <div className="text-xs uppercase text-[var(--primary)]">Date & Time</div>
            <div className="font-semibold">{formatTime(match.startTime)}</div>
          </div>
          <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-3">
            <div className="text-xs uppercase text-[var(--primary)]">Entry Fee</div>
            <div className="font-semibold">₹{match.entryFee}</div>
          </div>
        </div>
        <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-3 text-sm text-slate-200">
          <div className="text-xs uppercase text-[var(--primary)]">Prize Breakdown</div>
          <div className="mt-2 grid grid-cols-3 gap-3">
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase text-[var(--primary)]">
            <span>Team Name</span>
            {defaultTeamName && (
              <button
                type="button"
                onClick={() => setTeamName(defaultTeamName)}
                className="text-[var(--accent-primary)] underline"
              >
                Use my name
              </button>
            )}
          </div>
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Your team name"
            className="w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
            disabled={loading}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
            disabled={loading}
          />
          I agree to the rules and fair-play policy
        </label>
        {message && <p className="text-sm text-red-400">{message}</p>}
        <div className="flex items-center gap-3">
          <button
            onClick={handleProceed}
            disabled={!agree || loading}
            className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-black hover:bg-[#63ff9b] disabled:opacity-60"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-[#1f2937] px-4 py-3 text-sm text-slate-200 hover:border-[var(--primary)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;
