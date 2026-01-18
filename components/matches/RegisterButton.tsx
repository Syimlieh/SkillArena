"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Match } from "@/types/match.types";
import { useAuth } from "@/context/AuthContext";
import RegisterModal from "@/components/matches/RegisterModal";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";

interface Props {
  match: Match;
  registrationStatus: RegistrationStatus | null;
  isRegistered?: boolean;
  registration?: {
    teamName?: string;
    captainBgmiId?: string;
    captainIgn?: string;
    squadBgmiIds?: string[];
  } | null;
  canEdit?: boolean;
}

const RegisterButton = ({ match, registrationStatus, isRegistered, registration, canEdit }: Props) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const derivedRegistered =
    isRegistered || registrationStatus === RegistrationStatus.PENDING_PAYMENT || registrationStatus === RegistrationStatus.CONFIRMED;
  const statusLabel =
    registrationStatus === RegistrationStatus.PENDING_PAYMENT ? "Payment Pending" : derivedRegistered ? "Registered" : null;

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }
    if (derivedRegistered) return;
    setOpen(true);
  };

  if (isAdmin) return null;

  return (
    <div className="space-y-3">
      {derivedRegistered ? (
        <div className="space-y-2">
          {canEdit ? (
            <button
              onClick={() => setOpen(true)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-3 text-center text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
            >
              Edit Registration
            </button>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">
              {statusLabel ?? "Registered"}
            </div>
          )}
          {!canEdit && (
            <div className="text-center text-xs text-[var(--text-secondary)]">
              Registration updates are locked for this match.
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--accent-secondary)]"
        >
          {isAuthenticated ? "Register" : "Login to Register"}
        </button>
      )}
      <RegisterModal match={match} isOpen={open} onClose={() => setOpen(false)} registration={registration ?? undefined} />
    </div>
  );
};

export default RegisterButton;
