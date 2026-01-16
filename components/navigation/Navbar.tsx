"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { NavItem } from "@/config/navigation";

interface NavbarUser {
  name?: string;
  avatarUrl?: string;
}

interface Props {
  items: NavItem[];
  isAuthenticated: boolean;
  dashboardHref: string;
  user?: NavbarUser;
  onLogout?: () => void;
  onOpenSidebar?: () => void;
  showHamburger?: boolean;
  onProfile?: () => void;
}

const initialsFromName = (name?: string) => {
  if (!name) return "SA";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Navbar = ({
  items,
  isAuthenticated,
  dashboardHref,
  user,
  onLogout,
  onOpenSidebar,
  showHamburger,
  onProfile,
}: Props) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = useMemo(() => initialsFromName(user?.name), [user?.name]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            {showHamburger && (
              <button
                type="button"
                onClick={onOpenSidebar}
                className="rounded-full border border-[var(--border-subtle)] p-2 text-sm text-[var(--text-primary)] md:hidden"
                aria-label="Open navigation"
              >
                ☰
              </button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-primary)]/18 text-lg font-black text-[var(--accent-primary)]">
                BG
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-[var(--text-primary)]">SkillArena</span>
                <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Esports</span>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--text-primary)] md:flex">
            {items.map((item) => {
              const active = item.href ? pathname === item.href || pathname.startsWith(item.href) : false;
              return (
                <Link key={item.id} href={item.href ?? "#"} className="group relative pb-2">
                  <span className="transition-colors group-hover:text-[var(--accent-primary)]">{item.label}</span>
                  {active && <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-10 rounded-full bg-[var(--accent-primary)]" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link href={dashboardHref} className="hidden rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)] md:inline-flex">
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)]"
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user?.name ?? "Profile"} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-bold">
                        {initials}
                      </div>
                    )}
                    <span className="hidden text-xs uppercase tracking-wide text-[var(--text-secondary)] sm:inline">
                      {user?.name ?? "Player"}
                    </span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-2 shadow-lg">
                      <button
                        type="button"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                        onClick={() => {
                          setMenuOpen(false);
                          onProfile?.();
                        }}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onLogout?.();
                        }}
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-[var(--bg-secondary)]"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
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
    </>
  );
};

export default Navbar;
