"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface Props {
  matchId: string;
  disabled?: boolean;
}

export const StartMatchButton = ({ matchId, disabled }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [message, setMessage] = useState("Room details are live. Good luck and play fair.");

  const handleClose = useCallback(() => {
    if (!loading) setOpen(false);
  }, [loading]);

  const handleStart = async () => {
    if (disabled || loading) return;
    const trimmedRoomId = roomId.trim();
    const trimmedRoomPassword = roomPassword.trim();
    if (!trimmedRoomId || !trimmedRoomPassword) {
      setError("Room ID and password are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: trimmedRoomId,
          roomPassword: trimmedRoomPassword,
          message: message.trim() ? message.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setError(data?.error?.message || "Unable to start match.");
        setLoading(false);
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <Button onClick={() => setOpen(true)} disabled={disabled}>
        Share Room & Start Match
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Modal
        isOpen={open}
        onClose={handleClose}
        title="Share room details"
        disableBackdropClose={loading}
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Enter the room ID and password to email all registered players before the match starts.
          </p>
          <label className="space-y-2 text-sm">
            <span className="text-[var(--text-primary)]">Room ID</span>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-[var(--text-primary)] outline-none"
              placeholder="Enter room id"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-[var(--text-primary)]">Room Password</span>
            <input
              type="text"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-[var(--text-primary)] outline-none"
              placeholder="Enter room password"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-[var(--text-primary)]">Message (optional)</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-[var(--text-primary)] outline-none"
            />
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleStart} disabled={loading}>
              {loading ? "Sending..." : "Send to players & start"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StartMatchButton;
