"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface Props {
  matchId: string;
  disabled?: boolean;
}

export const StartMatchButton = ({ matchId, disabled }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (disabled || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/start`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setError(data?.error?.message || "Unable to start match.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleStart} disabled={disabled || loading}>
        {loading ? "Starting..." : "Start Match"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default StartMatchButton;
