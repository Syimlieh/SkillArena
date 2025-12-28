import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

const MatchesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar variant="app" />
      {children}
    </>
  );
};

export default MatchesLayout;
