"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Tournaments", href: "/dashboard" },
  { label: "Rules", href: "/dashboard#rules" },
];

export const Navbar = () => {
  const { isAdmin } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-[#0f172a] bg-[#05070bcc] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-[var(--primary)]/15 neon-border flex items-center justify-center text-lg font-black text-[var(--primary)]">
            BG
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm uppercase text-slate-400">{BRAND.name}</span>
            <span className="text-lg font-black text-white">Esports</span>
          </div>
        </Link>
        <nav className="flex items-center gap-8 text-sm font-semibold text-slate-200">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--primary)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link href="/dashboard/admin/create-match">
              <Button variant="secondary">Create Match</Button>
            </Link>
          )}
          <Link href="/auth/login" className="inline-block">
            <Button variant="ghost">Login</Button>
          </Link>
          <Button>Join Next Match</Button>
        </div>
      </div>
    </header>
  );
};
