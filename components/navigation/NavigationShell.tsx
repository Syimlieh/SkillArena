"use client";

import { CSSProperties, ReactNode, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthStatus } from "@/enums/AuthStatus.enum";
import { useSidebar } from "@/hooks/useSidebar";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import MobileSidebar from "@/components/navigation/MobileSidebar";
import { topNavItems, filterSectionsByRole, filterAccountItemsByRole, NavItem } from "@/config/navigation";
import { resolveDashboardRoute } from "@/modules/navigation/navigation.service";
import ProfileModal from "@/components/profile/ProfileModal";

interface Props {
  variant?: "public" | "app";
  children: ReactNode;
}

const NavigationShell = ({ variant = "public", children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { state, logout } = useAuth();
  const { isCollapsed, toggleCollapsed, isMobileOpen, setIsMobileOpen, hydrated } = useSidebar();
  const isAuthenticated = state.status === AuthStatus.AUTHENTICATED;
  const role = state.user?.role ?? null;
  const dashboardHref = useMemo(() => resolveDashboardRoute(state.user?.role), [state.user?.role]);
  const [profileOpen, setProfileOpen] = useState(false);

  const sections = useMemo(() => filterSectionsByRole(role), [role]);
  const accountItems = useMemo(() => filterAccountItemsByRole(role), [role]);

  const handleAction = (item: NavItem) => {
    if (item.action === "profile") {
      setProfileOpen(true);
      return;
    }
    if (item.action === "logout") {
      logout();
      router.push("/");
    }
  };

  // Dashboard routes are server-protected, so reserve sidebar space immediately
  // to avoid content shifting while auth profile hydrates on the client.
  const showSidebar = variant === "app" ? true : isAuthenticated;

  const sidebarWidth = isCollapsed ? "5rem" : "16rem";
  const shellStyle = { "--sidebar-width": sidebarWidth } as CSSProperties;

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-[var(--bg-primary)] ${
        variant === "public" ? "pb-0" : "pb-2"
      }`}
      style={shellStyle}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_15%,rgba(49,255,225,0.12),transparent_26%),radial-gradient(circle_at_86%_82%,rgba(155,255,77,0.12),transparent_28%)]" />
      <Navbar
        items={topNavItems}
        isAuthenticated={isAuthenticated}
        dashboardHref={dashboardHref}
        user={{ name: state.user?.name, avatarUrl: state.user?.avatarUrl }}
        onLogout={() => {
          logout();
          router.push("/");
        }}
        onOpenSidebar={() => setIsMobileOpen(true)}
        showHamburger={showSidebar}
        onProfile={() => setProfileOpen(true)}
      />

      <div
        className={
          showSidebar
            ? `flex min-w-0 md:pl-[var(--sidebar-width)] ${
                hydrated ? "md:transition-[padding-left] md:duration-[420ms] md:ease-in-out" : ""
              }`
            : ""
        }
      >
        {showSidebar ? (
          <Sidebar
            sections={sections}
            accountItems={accountItems}
            isCollapsed={isCollapsed}
            activePath={pathname}
            onToggleCollapsed={toggleCollapsed}
            onAction={handleAction}
            enableTransitions={hydrated}
          />
        ) : null}
        <div key={pathname} className={showSidebar ? "page-reveal flex-1 min-w-0" : "page-reveal w-full"}>{children}</div>
      </div>

      {showSidebar ? (
        <MobileSidebar
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          sections={sections}
          accountItems={accountItems}
          activePath={pathname}
          onAction={handleAction}
        />
      ) : null}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
};

export default NavigationShell;
