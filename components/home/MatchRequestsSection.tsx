"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import apiClient from "@/lib/apiClient";
import { MatchRequestPublic } from "@/types/match-request.types";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchRequestType } from "@/enums/MatchRequestType.enum";
import { MatchRequestStatus } from "@/enums/MatchRequestStatus.enum";
import { useAuth } from "@/context/AuthContext";

interface Props {
  initialRequests: MatchRequestPublic[];
}

const fieldClass =
  "neon-input w-full rounded-xl px-3 py-2 text-sm text-[var(--text-primary)]";

export const MatchRequestsSection = ({ initialRequests }: Props) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<MatchRequestPublic[]>(initialRequests);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    map: MatchMap.ERANGEL,
    matchType: MatchRequestType.SQUAD,
    preferredTimeRange: "",
    entryFeeRange: "",
    note: "",
  });

  // SSR provides fresh initialRequests — no need to re-fetch on mount

  const closeModal = useCallback(() => setOpen(false), []);

  const sortedRequests = useMemo(
    () => [...requests].sort((a, b) => b.voteCount - a.voteCount),
    [requests]
  );

  const updateRequest = (id: string, update: Partial<MatchRequestPublic>) => {
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, ...update } : request)));
  };

  const handleVote = async (request: MatchRequestPublic) => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/");
      return;
    }
    setError(null);
    try {
      if (request.hasVoted) {
        const res = await apiClient.delete(`/api/match-requests/${request.id}/vote`);
        const data = res.data?.data ?? res.data ?? {};
        updateRequest(request.id, { voteCount: data.voteCount ?? request.voteCount, hasVoted: false });
      } else {
        const res = await apiClient.post(`/api/match-requests/${request.id}/vote`);
        const data = res.data?.data ?? res.data ?? {};
        updateRequest(request.id, { voteCount: data.voteCount ?? request.voteCount + 1, hasVoted: true });
      }
    } catch (err: any) {
      setError(err?.message ?? "Unable to update vote.");
    }
  };

  const handleCreate = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const payload = {
        map: form.map,
        matchType: form.matchType,
        preferredTimeRange: form.preferredTimeRange.trim(),
        entryFeeRange: form.entryFeeRange.trim() || undefined,
        note: form.note.trim() || undefined,
      };
      const res = await apiClient.post("/api/match-requests", payload);
      const created = res.data?.data?.request ?? res.data?.request;
      if (created) {
        setRequests((prev) => [created, ...prev]);
      }
      setOpen(false);
      setForm({
        map: MatchMap.ERANGEL,
        matchType: MatchRequestType.SQUAD,
        preferredTimeRange: "",
        entryFeeRange: "",
        note: "",
      });
    } catch (err: any) {
      setError(err?.message ?? "Unable to create match request.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section id="match-requests" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Match Requests</h2>
          <p className="text-sm text-[var(--text-secondary)]">Vote on community requests or suggest a new match.</p>
        </div>
        <Button type="button" onClick={() => setOpen(true)} className="w-fit">
          Request a Match
        </Button>
      </div>

      {sortedRequests.length === 0 ? (
        <div className="glass-panel rounded-2xl px-4 py-6 text-[var(--text-secondary)]">
          No match requests yet. Be the first to request a match.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedRequests.map((request) => (
            <div
              key={request.id}
              className="glass-panel glow-hover rounded-2xl p-4"
            >
              <div className="flex items-center justify-between text-xs uppercase text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--accent-primary)]">{request.map}</span>
                <Badge tone={request.status === MatchRequestStatus.OPEN ? "success" : "neutral"} className="text-[10px]">
                  {request.status === MatchRequestStatus.OPEN ? "Open" : request.status}
                </Badge>
              </div>
              <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center justify-between">
                  <span>Mode</span>
                  <span className="font-semibold text-[var(--text-primary)]">{request.matchType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Preferred Time</span>
                  <span className="font-semibold text-[var(--text-primary)]">{request.preferredTimeRange}</span>
                </div>
                {request.entryFeeRange ? (
                  <div className="flex items-center justify-between">
                    <span>Entry Fee</span>
                    <span className="font-semibold text-[var(--text-primary)]">{request.entryFeeRange}</span>
                  </div>
                ) : null}
                {request.note ? <p className="text-xs text-[var(--text-secondary)]">{request.note}</p> : null}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleVote(request)}
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
                    request.hasVoted
                      ? "border-[var(--panel-border)] bg-[var(--badge-bg)] text-[var(--primary)]"
                      : "border-[var(--panel-border)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
                  )}
                >
                  {request.hasVoted ? "Voted" : "Vote"}
                  <span className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px]">
                    {request.voteCount}
                  </span>
                </button>
                <span className="text-xs text-[var(--text-secondary)]">
                  {new Date(request.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={open} onClose={closeModal} title="Request a Match" disableBackdropClose>
        <div className="space-y-4 text-[var(--text-primary)]">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>Map</span>
              <select
                value={form.map}
                onChange={(e) => setForm((prev) => ({ ...prev, map: e.target.value as MatchMap }))}
                className={fieldClass}
              >
                {Object.values(MatchMap).map((map) => (
                  <option key={map} value={map}>
                    {map}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span>Match Type</span>
              <select
                value={form.matchType}
                onChange={(e) => setForm((prev) => ({ ...prev, matchType: e.target.value as MatchRequestType }))}
                className={fieldClass}
              >
                {Object.values(MatchRequestType).map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="space-y-2 text-sm">
            <span>Preferred Time Range</span>
            <input
              value={form.preferredTimeRange}
              onChange={(e) => setForm((prev) => ({ ...prev, preferredTimeRange: e.target.value }))}
              placeholder="9-11 PM"
              className={fieldClass}
            />
          </label>
          <label className="space-y-2 text-sm">
            <span>Entry Fee Range (optional)</span>
            <input
              value={form.entryFeeRange}
              onChange={(e) => setForm((prev) => ({ ...prev, entryFeeRange: e.target.value }))}
              placeholder="₹50-₹100"
              className={fieldClass}
            />
          </label>
          <label className="space-y-2 text-sm">
            <span>Note (optional)</span>
            <textarea
              value={form.note}
              onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
              rows={3}
              className={fieldClass}
              placeholder="Any extra context for admins."
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreate} disabled={!form.preferredTimeRange.trim()} loading={creating}>
              {creating ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default MatchRequestsSection;
