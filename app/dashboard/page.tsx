import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth.server";
import { UserRole } from "@/enums/UserRole.enum";
import { getUserDashboardStats } from "@/modules/dashboard/dashboard.service";
import { UserOverview } from "@/components/dashboard/UserOverview";

const DashboardPage = async () => {
  const user = await requireUser();
  if (user.role === UserRole.ADMIN) {
    redirect("/dashboard/admin");
  }

  const stats = await getUserDashboardStats(user.userId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:px-8">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] drop-shadow-[0_0_20px_rgba(49,255,225,0.16)]">Player Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Track scrims, payouts, and performance</p>
      </div>
      <UserOverview stats={stats} />
    </div>
  );
};

export default DashboardPage;
