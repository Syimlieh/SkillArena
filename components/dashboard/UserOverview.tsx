import Link from "next/link";
import { CalendarCheck, Swords, History, Trophy } from "lucide-react";
import type { UserDashboardStats } from "@/modules/dashboard/dashboard.service";

interface Props {
  stats: UserDashboardStats;
}

const cards = [
  { key: "registered", label: "My Matches", href: "/dashboard/my-matches", icon: CalendarCheck, color: "text-[var(--primary)]" },
  { key: "available", label: "Available Matches", href: "/dashboard/available", icon: Swords, color: "text-blue-400" },
  { key: "history", label: "Match History", href: "/dashboard/history", icon: History, color: "text-slate-300" },
  { key: "hosted", label: "Hosted Matches", href: "/dashboard/hosted", icon: Trophy, color: "text-orange-300" },
] as const;

export const UserOverview = ({ stats }: Props) => {
  const countMap: Record<string, number> = {
    registered: stats.registeredCount,
    available: stats.availableCount,
    history: stats.historyCount,
    hosted: stats.hostedCount,
  };

  const visibleCards = cards.filter(
    (c) => c.key !== "hosted" || stats.hostedCount > 0
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleCards.map(({ key, label, href, icon: Icon, color }) => (
        <Link
          key={key}
          href={href}
          className="glass-panel glow-hover group rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="text-xs uppercase text-[var(--text-secondary)]">{label}</span>
          </div>
          <div className="mt-3 text-3xl font-black text-[var(--text-primary)]">
            {countMap[key]}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserOverview;
