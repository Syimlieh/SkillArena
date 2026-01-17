"use client";

import { Children, ReactNode, useMemo, useState } from "react";
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
  const { isCollapsed, toggleCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const isAuthenticated = state.status === AuthStatus.AUTHENTICATED;
  const role = state.user?.role ?? null;
  const dashboardHref = useMemo(() => resolveDashboardRoute(state.user?.role), [state.user?.role]);
  const [profileOpen, setProfileOpen] = useState(false);
  const content = useMemo(() => Children.toArray(children), [children]);

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

  const showSidebar = isAuthenticated;

  const sidebarWidth = isCollapsed ? "5rem" : "16rem";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-primary)]" style={{ ["--sidebar-width" as any]: sidebarWidth }}>
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

      <div className={showSidebar ? "flex min-w-0 md:pl-[var(--sidebar-width)]" : ""}>
        {showSidebar ? (
          <Sidebar
            sections={sections}
            accountItems={accountItems}
            isCollapsed={isCollapsed}
            activePath={pathname}
            onToggleCollapsed={toggleCollapsed}
            onAction={handleAction}
          />
        ) : null}
        <div className={showSidebar ? "flex-1 min-w-0" : "w-full"}>{content}</div>
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
