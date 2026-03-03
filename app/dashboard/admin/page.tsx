import { requireAdmin } from "@/lib/auth.server";
import { getAdminDashboardStats } from "@/modules/admin/admin.service";
import { AdminOverview } from "@/components/admin/AdminOverview";

const AdminDashboardPage = async () => {
  await requireAdmin();
  const stats = await getAdminDashboardStats();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:px-8">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] drop-shadow-[0_0_20px_rgba(49,255,225,0.16)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Overview of platform activity</p>
      </div>
      <AdminOverview stats={stats} />
    </div>
  );
};

export default AdminDashboardPage;
