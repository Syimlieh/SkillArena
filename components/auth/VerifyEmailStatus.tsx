"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type VerifyState = "loading" | "success" | "error";

export const VerifyEmailStatus = ({ token }: { token: string }) => {
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<VerifyState>("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      setStatus("loading");
      setMessage(null);
      try {
        const res = await fetch("/api/auth/verify/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (!res.ok || data?.success === false) {
          const errorMessage = data?.error?.message || data?.error || "Unable to verify email.";
          setStatus("error");
          setMessage(errorMessage);
          return;
        }
        setStatus("success");
        setMessage("Email verified successfully. You can now join matches.");
        await refreshProfile();
      } catch {
        if (!mounted) return;
        setStatus("error");
        setMessage("Network error while verifying. Please try again.");
      }
    };
    void verify();
    return () => {
      mounted = false;
    };
  }, [token, refreshProfile]);

  if (status === "loading") {
    return <p className="text-sm text-[var(--text-secondary)]">Verifying your email...</p>;
  }

  if (status === "success") {
    return <p className="text-sm text-[var(--accent-primary)]">{message}</p>;
  }

  return <p className="text-sm text-red-400">{message ?? "Unable to verify email."}</p>;
};
