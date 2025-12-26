import DashboardClient from "@/components/dashboard/DashboardClient";
import { getDashboardData } from "@/modules/dashboard/dashboard.service";

const DashboardShell = async () => {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
};

export default DashboardShell;
