import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import NavigationShell from "@/components/navigation/NavigationShell";

const PublicLayout = ({ children }: { children: ReactNode }) => (
  <NavigationShell variant="public">
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-[radial-gradient(circle_at_20%_18%,rgba(49,255,225,0.12),transparent_24%),radial-gradient(circle_at_86%_6%,rgba(155,255,77,0.09),transparent_28%),radial-gradient(circle_at_52%_86%,rgba(255,94,164,0.08),transparent_30%)]">
        {children}
      </main>
      <Footer />
    </div>
  </NavigationShell>
);

export default PublicLayout;
