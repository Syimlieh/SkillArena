import Link from "next/link";
import { Swords, Inbox, History, Play } from "lucide-react";
import type { AdminDashboardStats } from "@/modules/admin/admin.service";

interface Props {
  stats: AdminDashboardStats;
}

const cards = [
  { key: "ongoing", label: "Ongoing Matches", href: "/dashboard/admin/matches", icon: Play, color: "text-orange-300" },
  { key: "upcoming", label: "Upcoming Matches", href: "/dashboard/admin/matches", icon: Swords, color: "text-[var(--primary)]" },
  { key: "pendingRequests", label: "Pending Requests", href: "/dashboard/admin/match-requests", icon: Inbox, color: "text-blue-400" },
  { key: "completed", label: "Completed Matches", href: "/dashboard/admin/match-history", icon: History, color: "text-slate-300" },
] as const;

export const AdminOverview = ({ stats }: Props) => {
  const countMap: Record<string, number> = {
    ongoing: stats.ongoingCount,
    upcoming: stats.upcomingCount,
    pendingRequests: stats.pendingRequestsCount,
    completed: stats.completedCount,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, href, icon: Icon, color }) => (
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

export default AdminOverview;
