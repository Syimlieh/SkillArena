import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth.server";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  try {
    await requireAdmin();
  } catch {
    redirect("/auth/login?redirect=/dashboard/admin");
  }

  return (
    <>
      {children}
    </>
  );
};

export default AdminLayout;
