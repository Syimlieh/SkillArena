import { ReactNode } from "react";
import NavigationShell from "@/components/navigation/NavigationShell";

const MatchesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <NavigationShell variant="public">{children}</NavigationShell>
  );
};

export default MatchesLayout;
