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

  const isPaymentPending = registrationStatus === RegistrationStatus.PENDING_PAYMENT;
  const derivedRegistered =
    isRegistered || isPaymentPending || registrationStatus === RegistrationStatus.CONFIRMED;
  const statusLabel =
    isPaymentPending ? "Payment Pending" : derivedRegistered ? "Registered" : null;

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }
    if (derivedRegistered && !isPaymentPending) return;
    setOpen(true);
  };

  if (isAdmin) return null;

  return (
    <div className="space-y-3">
      {derivedRegistered ? (
        <div className="space-y-2">
          {isPaymentPending ? (
            <button
              onClick={() => setOpen(true)}
              className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--accent-secondary)]"
            >
              Complete Payment
            </button>
          ) : canEdit ? (
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
          {!canEdit && !isPaymentPending && (
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
      <RegisterModal
        match={match}
        isOpen={open}
        onClose={() => setOpen(false)}
        registration={registration ?? undefined}
        paymentPending={isPaymentPending}
      />
    </div>
  );
};

export default RegisterButton;
