"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { resolveDashboardRoute } from "@/modules/navigation/navigation.service";
import { UserRole } from "@/enums/UserRole.enum";
import { useEffect, useRef } from "react";
import ProfileModal from "@/components/profile/ProfileModal";

const initialsFromName = (name?: string) => {
  if (!name) return "SA";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfileDropdown = () => {
  const { state, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const avatarUrl = state.user?.avatarUrl;

  const dashboardHref = useMemo(() => resolveDashboardRoute(state.user?.role), [state.user?.role]);
  const initials = useMemo(() => initialsFromName(state.user?.name), [state.user?.name]);
  const isHost = state.user?.role === UserRole.HOST;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[#1f2937] bg-[#0c111a] px-3 py-2 text-sm text-white"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={state.user?.name ?? "Profile"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-bold">
            {initials}
          </div>
        )}
        <span className="hidden sm:inline text-xs uppercase tracking-wide text-slate-300">
          {state.user?.name ?? "Player"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#1f2937] bg-[#0c111a] p-2 shadow-lg">
          <Link
            href={dashboardHref}
            className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-[#111827]"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <button
            className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-[#111827]"
            onClick={() => {
              setOpen(false);
              setProfileOpen(true);
            }}
          >
            Update Profile
          </button>
          {isHost && (
            <Link
              href="/dashboard/host/matches"
              className="mt-1 block rounded-lg px-3 py-2 text-sm text-white hover:bg-[#111827]"
              onClick={() => setOpen(false)}
            >
              Your Matches
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-[#111827]"
          >
            Logout
          </button>
        </div>
      )}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
};

export default ProfileDropdown;
