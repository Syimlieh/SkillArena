"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";
import Modal from "@/components/ui/Modal";
import { Match } from "@/types/match.types";
import { useAuth } from "@/context/AuthContext";
import { BGMI_ID_LENGTH } from "@/lib/constants";

interface Props {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  registration?: {
    teamName?: string;
    captainBgmiId?: string;
    captainIgn?: string;
    squadBgmiIds?: string[];
  } | null;
  paymentPending?: boolean;
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

const RegisterModal = ({ match, isOpen, onClose, registration, paymentPending }: Props) => {
  const router = useRouter();
  const { state } = useAuth();
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [teamName, setTeamName] = useState("");
  const [captainBgmiId, setCaptainBgmiId] = useState("");
  const [captainIgn, setCaptainIgn] = useState("");
  const [squadBgmiIds, setSquadBgmiIds] = useState<string[]>(["", "", ""]);

  const defaultTeamName = state.user?.name ?? "";
  const isEditing = Boolean(registration);
  const shouldCreateOrder = !isEditing || Boolean(paymentPending);

  useEffect(() => {
    if (!isOpen) return;
    setMessage(undefined);
    setAgree(false);
    setTeamName(registration?.teamName?.trim() || defaultTeamName);
    setCaptainBgmiId(registration?.captainBgmiId ?? "");
    setCaptainIgn(registration?.captainIgn ?? "");
    const defaults = registration?.squadBgmiIds?.slice(0, 3) ?? [];
    setSquadBgmiIds([defaults[0] ?? "", defaults[1] ?? "", defaults[2] ?? ""]);
  }, [isOpen, defaultTeamName, registration]);

  const normalizedSquadIds = useMemo(
    () => squadBgmiIds.map((id) => id.replace(/\s+/g, "")),
    [squadBgmiIds]
  );

  const validateBgmiId = (id: string) => {
    if (!/^\d+$/.test(id)) return false;
    return id.length >= BGMI_ID_LENGTH.min && id.length <= BGMI_ID_LENGTH.max;
  };

  const handleProceed = async () => {
    if (state.user && !state.user.emailVerified) {
      setMessage("Please verify your email before joining a match.");
      return;
    }
    if (!agree) {
      setMessage("Please agree to the rules and fair-play policy.");
      return;
    }
    if (!teamName.trim()) {
      setMessage("Please add a team name.");
      return;
    }
    const captainId = captainBgmiId.replace(/\s+/g, "");
    if (!captainId) {
      setMessage("Captain BGMI ID is required.");
      return;
    }
    if (!validateBgmiId(captainId)) {
      setMessage(`Captain BGMI ID must be ${BGMI_ID_LENGTH.min}-${BGMI_ID_LENGTH.max} digits.`);
      return;
    }
    const filteredSquad = normalizedSquadIds.filter(Boolean);
    for (const id of filteredSquad) {
      if (!validateBgmiId(id)) {
        setMessage(`All BGMI IDs must be ${BGMI_ID_LENGTH.min}-${BGMI_ID_LENGTH.max} digits.`);
        return;
      }
    }
    const allIds = [captainId, ...filteredSquad];
    if (new Set(allIds).size !== allIds.length) {
      setMessage("BGMI IDs must be unique.");
      return;
    }
    setLoading(true);
    setMessage(undefined);
    try {
      if (!shouldCreateOrder) {
        const res = await fetch(`/api/matches/${encodeURIComponent(match.matchId)}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamName: teamName.trim(),
            captainBgmiId: captainId,
            captainIgn: captainIgn.trim() || undefined,
            squadBgmiIds: filteredSquad.length ? filteredSquad : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          setMessage(data?.error?.message || data?.error || "Unable to update registration.");
          setLoading(false);
          return;
        }
        setMessage("Registration updated.");
        setLoading(false);
        onClose();
        router.refresh();
        return;
      }

      const res = await fetch(`/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.matchId,
          teamName: teamName.trim(),
          captainBgmiId: captainId,
          captainIgn: captainIgn.trim() || undefined,
          squadBgmiIds: filteredSquad.length ? filteredSquad : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setMessage(data?.error?.message || data?.error || "Unable to register.");
        setLoading(false);
        return;
      }
      const sessionId = data?.data?.paymentSessionId ?? data?.paymentSessionId;
      const checkoutUrl = data?.data?.checkoutUrl ?? data?.checkoutUrl;
      const cashfreeMode = data?.data?.cashfreeMode ?? data?.cashfreeMode;
      if (!sessionId || !checkoutUrl) {
        setMessage("Payment session not available. Please try again.");
        setLoading(false);
        return;
      }
      setMessage(undefined);
      onClose();
      try {
        const cashfree = await load({ mode: cashfreeMode === "production" ? "production" : "sandbox" });
        await cashfree.checkout({ paymentSessionId: sessionId, redirectTarget: "_self" });
      } catch {
        window.location.href = checkoutUrl;
      }
    } catch {
      setMessage("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={shouldCreateOrder ? "Confirm Registration" : "Edit Registration"}
      disableBackdropClose
    >
      <div className="space-y-3 text-[var(--text-primary)]">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm">
          <div className="text-xs uppercase text-[var(--primary)]">Match</div>
          <div className="font-semibold">{match.title}</div>
          <div className="text-[var(--text-secondary)]">ID: {match.matchId}</div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-[var(--text-secondary)]">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3">
            <div className="text-xs uppercase text-[var(--primary)]">Date & Time</div>
            <div className="font-semibold text-[var(--text-primary)]">{formatTime(match.startTime)}</div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3">
            <div className="text-xs uppercase text-[var(--primary)]">Entry Fee</div>
            <div className="font-semibold text-[var(--text-primary)]">₹{match.entryFee}</div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm text-[var(--text-secondary)]">
          <div className="text-xs uppercase text-[var(--primary)]">Prize Breakdown</div>
          <div className="mt-2 grid grid-cols-3 gap-3">
            <div>
              <div className="font-semibold text-[var(--text-primary)]">1st</div>
              <div className="text-[var(--text-secondary)]">₹1370</div>
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">2nd</div>
              <div className="text-[var(--text-secondary)]">₹150</div>
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">3rd</div>
              <div className="text-[var(--text-secondary)]">₹80</div>
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
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase text-[var(--primary)]">Captain Details</div>
          <label className="space-y-2 text-sm text-[var(--text-secondary)]">
            <span>Captain BGMI ID</span>
            <input
              value={captainBgmiId}
              onChange={(e) => setCaptainBgmiId(e.target.value)}
              placeholder="Enter captain BGMI ID"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]"
              disabled={loading}
            />
          </label>
          <label className="space-y-2 text-sm text-[var(--text-secondary)]">
            <span>Captain IGN (optional)</span>
            <input
              value={captainIgn}
              onChange={(e) => setCaptainIgn(e.target.value)}
              placeholder="In-game name"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]"
              disabled={loading}
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase text-[var(--primary)]">Squad BGMI IDs</div>
          {normalizedSquadIds.map((value, index) => (
            <input
              key={`squad-${index}`}
              value={squadBgmiIds[index]}
              onChange={(e) => {
                const next = [...squadBgmiIds];
                next[index] = e.target.value;
                setSquadBgmiIds(next);
              }}
              placeholder={`Player ${index + 2} BGMI ID`}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]"
              disabled={loading}
            />
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
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
            className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-secondary)] disabled:opacity-60"
          >
            {loading ? "Processing..." : shouldCreateOrder ? "Proceed to Payment" : "Save Registration"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-[var(--border-subtle)] px-4 py-3 text-sm text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;
