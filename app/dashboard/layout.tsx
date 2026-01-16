import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth.server";
import NavigationShell from "@/components/navigation/NavigationShell";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  try {
    await requireUser();
  } catch {
    redirect("/auth/login?redirect=/dashboard");
  }

  return (
    <NavigationShell variant="app">{children}</NavigationShell>
  );
};

export default DashboardLayout;
