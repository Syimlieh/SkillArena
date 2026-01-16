import { ReactNode } from "react";
import NavigationShell from "@/components/navigation/NavigationShell";

const RulesLayout = ({ children }: { children: ReactNode }) => {
  return <NavigationShell variant="public">{children}</NavigationShell>;
};

export default RulesLayout;
