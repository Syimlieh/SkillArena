"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { resolveDashboardRoute } from "@/modules/navigation/navigation.service";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { UserRole } from "@/enums/UserRole.enum";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface NavbarProps {
  variant?: "public" | "app" | "admin";
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Matches", href: "/dashboard" },
  { label: "Rules", href: "/rules" },
];

export const Navbar = ({ variant = "public" }: NavbarProps) => {
  const { isAdmin, isAuthenticated, state } = useAuth();
  const pathname = usePathname();
  const isHost = state.user?.role === UserRole.HOST;
  const dashboardHref = useMemo(() => resolveDashboardRoute(state.user?.role), [state.user?.role]);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-primary)]/18 text-lg font-black text-[var(--accent-primary)]">
            BG
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-[var(--text-primary)]">SkillArena</span>
            <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Esports</span>
          </div>
        </Link>

        {variant === "public" ? (
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--text-primary)] md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className="group relative pb-2">
                  <span className="transition-colors group-hover:text-[var(--accent-primary)]">{item.label}</span>
                  {active && <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-10 rounded-full bg-[var(--accent-primary)]" />}
                </Link>
              );
            })}
          </nav>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && (
            <Link href={dashboardHref}>
              <Button variant="ghost">Dashboard</Button>
            </Link>
          )}
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
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
            >
              Login
              <span className="text-lg leading-none">›</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
