import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrimProvider } from "@/context/ScrimContext";
import { AuthProvider } from "@/context/AuthContext";

const PublicLayout = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <ScrimProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-[radial-gradient(circle_at_20%_20%,rgba(66,255,135,0.06),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(20,180,111,0.06),transparent_30%),#05070b]">
          {children}
        </main>
        <Footer />
      </div>
    </ScrimProvider>
  </AuthProvider>
);

export default PublicLayout;
