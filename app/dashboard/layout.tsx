import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar variant="app" />
      {children}
    </>
  );
};

export default DashboardLayout;
