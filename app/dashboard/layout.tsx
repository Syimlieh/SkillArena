import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { requireUser } from "@/lib/auth.server";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  try {
    await requireUser();
  } catch {
    redirect("/auth/login?redirect=/dashboard");
  }

  return (
    <>
      <Navbar variant="app" />
      {children}
    </>
  );
};

export default DashboardLayout;
