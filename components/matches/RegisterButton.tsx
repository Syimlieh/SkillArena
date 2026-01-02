"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Match } from "@/types/match.types";
import { useAuth } from "@/context/AuthContext";
import RegisterModal from "@/components/matches/RegisterModal";

interface Props {
  match: Match;
}

const RegisterButton = ({ match }: Props) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }
    setOpen(true);
  };

  if (isAdmin) return null;

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-black hover:bg-[#63ff9b]"
      >
        {isAuthenticated ? "Register" : "Login to Register"}
      </button>
      <RegisterModal match={match} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default RegisterButton;
