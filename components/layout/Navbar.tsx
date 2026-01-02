"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { resolveDashboardRoute } from "@/modules/navigation/navigation.service";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { UserRole } from "@/enums/UserRole.enum";

interface NavbarProps {
  variant?: "public" | "app" | "admin";
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Tournaments", href: "/dashboard" },
  { label: "Rules", href: "/rules" },
];

export const Navbar = ({ variant = "public" }: NavbarProps) => {
  const { isAdmin, isAuthenticated, state } = useAuth();
  const isHost = state.user?.role === UserRole.HOST;
  const dashboardHref = useMemo(() => resolveDashboardRoute(state.user?.role), [state.user?.role]);

  return (
    <header className="sticky top-0 z-30 border-b border-[#0f172a] bg-[#05070bcc] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={variant === "public" ? "/" : dashboardHref} className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-[var(--primary)]/15 neon-border flex items-center justify-center text-lg font-black text-[var(--primary)]">
            BG
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm uppercase text-slate-400">{BRAND.name}</span>
            <span className="text-lg font-black text-white">Esports</span>
          </div>
        </Link>

        {variant === "public" ? (
          <nav className="flex items-center gap-8 text-sm font-semibold text-slate-200">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[var(--primary)]">
                {item.label}
              </Link>
            ))}
          </nav>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated && !isAdmin && (
            isHost ? (
              <>
                <Link href="/dashboard/host/matches">
                  <Button variant="ghost">Your Matches</Button>
                </Link>
                <Link href="/dashboard/host/create-match">
                  <Button variant="secondary">Host a Match</Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard/host/apply">
                <Button variant="ghost">Become a Host</Button>
              </Link>
            )
          )}
          {isAdmin && (
            <>
              <Link href="/dashboard/admin/host-applications">
                <Button variant="ghost">Host Applications</Button>
              </Link>
              <Link href="/dashboard/admin/create-match">
                <Button variant="secondary">Create Match</Button>
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <Link href="/auth/login" className="inline-block">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
