import { ReactNode } from "react";
import NavigationShell from "@/components/navigation/NavigationShell";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <NavigationShell variant="public">{children}</NavigationShell>;
};

export default AuthLayout;
