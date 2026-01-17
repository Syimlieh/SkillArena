"use client";

import { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { ScrimProvider } from "@/context/ScrimContext";
import NavigationShell from "@/components/navigation/NavigationShell";

const PublicLayout = ({ children }: { children: ReactNode }) => (
  <ScrimProvider>
    <NavigationShell variant="public">
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-[radial-gradient(circle_at_20%_20%,rgba(66,255,135,0.06),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(20,180,111,0.06),transparent_30%),#05070b]">
          {children}
        </main>
        <Footer />
      </div>
    </NavigationShell>
  </ScrimProvider>
);

export default PublicLayout;
