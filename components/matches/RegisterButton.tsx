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
}

const RegisterButton = ({ match, registrationStatus, isRegistered }: Props) => {
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
        <div className="flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">
          {statusLabel ?? "Registered"}
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-black hover:bg-[#63ff9b]"
        >
          {isAuthenticated ? "Register" : "Login to Register"}
        </button>
      )}
      <RegisterModal match={match} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default RegisterButton;
