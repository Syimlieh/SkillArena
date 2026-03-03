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
      <header className="sticky top-0 z-40 border-b border-[var(--panel-border)] bg-[var(--bg-primary)]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            {showHamburger && (
              <button
                type="button"
                onClick={onOpenSidebar}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--bg-secondary)]/70 text-sm leading-none text-[var(--text-primary)] shadow-[0_0_20px_rgba(49,255,225,0.15)] transition hover:border-[var(--accent-primary)] md:hidden"
                aria-label="Open navigation"
              >
                ☰
              </button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--accent-primary)]/14 text-lg font-black text-[var(--accent-primary)] shadow-[0_0_24px_rgba(49,255,225,0.2)]">
                BG
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-[var(--text-primary)]">SkillArena</span>
                <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Esports</span>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--text-primary)] md:flex">
            {items.map((item) => {
              const active = item.href
                ? item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
                : false;
              return (
                <Link key={item.id} href={item.href ?? "#"} className="group relative pb-2">
                  <span className="transition-colors group-hover:text-[var(--accent-primary)]">{item.label}</span>
                  {active && <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-10 rounded-full bg-[var(--accent-primary)] shadow-[0_0_18px_var(--accent-primary)]" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link href={dashboardHref} className="hidden rounded-full border border-[var(--panel-border)] bg-[var(--bg-secondary)]/65 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] shadow-[0_0_20px_rgba(49,255,225,0.1)] transition hover:border-[var(--accent-primary)] md:inline-flex">
                  Dashboard
                </Link>
                <div className="relative z-50">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--card-bg)]/90 p-1 text-sm text-[var(--text-primary)] shadow-[0_0_20px_rgba(49,255,225,0.14)] transition hover:border-[var(--accent-primary)] sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user?.name ?? "Profile"} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/22 text-[var(--primary)] font-bold shadow-[0_0_16px_rgba(49,255,225,0.26)]">
                        {initials}
                      </div>
                    )}
                    <span className="hidden text-xs uppercase tracking-wide text-[var(--text-secondary)] sm:inline">
                      {user?.name ?? "Player"}
                    </span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full z-[80] mt-2 w-52 overflow-hidden rounded-xl border border-[var(--panel-border)] bg-[var(--bg-secondary)] p-2 shadow-[0_18px_46px_rgba(2,10,24,0.62)] ring-1 ring-black/20">
                      <button
                        type="button"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--card-bg)]/95"
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
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-[var(--card-bg)]/95"
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
                className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--card-bg)]/90 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] shadow-[0_0_20px_rgba(49,255,225,0.13)] transition hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
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
