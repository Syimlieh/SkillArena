import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

export default AdminLayout;
