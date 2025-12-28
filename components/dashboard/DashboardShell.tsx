import DashboardClient from "@/components/dashboard/DashboardClient";
import { getDashboardData } from "@/modules/dashboard/dashboard.service";
import { requireUser } from "@/lib/auth.server";

const DashboardShell = async () => {
  const user = await requireUser();
  const data = await getDashboardData(user.userId);
  return <DashboardClient data={data} />;
};

export default DashboardShell;
