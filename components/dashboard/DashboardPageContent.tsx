import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth.server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { UserRole } from "@/enums/UserRole.enum";

const DashboardPageContent = async () => {
  const user = await requireUser();
  if (user.role === UserRole.ADMIN) {
    redirect("/dashboard/admin");
  }
  return <DashboardShell />;
};

export default DashboardPageContent;
