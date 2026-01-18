import { UserRole } from "@/enums/UserRole.enum";
import { LayoutDashboard, BookOpen, ListChecks, Shield, ClipboardList, Users, User, LogOut } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  roles?: UserRole[];
  action?: "profile" | "logout";
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
};

export const topNavItems: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: LayoutDashboard },
  { id: "rules", label: "Rules", href: "/rules", icon: BookOpen },
];

const rolesAll = [UserRole.USER, UserRole.HOST, UserRole.ADMIN];

export const sidebarSections: NavSection[] = [
  {
    id: "general",
    label: "General",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: rolesAll },
      { id: "guide", label: "Match Guide", href: "/guide", icon: BookOpen, roles: rolesAll },
      { id: "rules", label: "Rules", href: "/rules", icon: BookOpen, roles: rolesAll },
      { id: "admin-host-apps", label: "Host Applications", href: "/dashboard/admin/host-applications", icon: Users, roles: [UserRole.ADMIN] },
      { id: "admin-create-match", label: "Create Match", href: "/dashboard/admin/create-match", icon: ClipboardList, roles: [UserRole.ADMIN] },
    ],
  },
  {
    id: "player",
    label: "Player",
    items: [
      { id: "requested-matches", label: "Requested Matches", href: "/#match-requests", icon: ListChecks, roles: [UserRole.USER] },
    ],
  },
  {
    id: "host",
    label: "Host",
    items: [
      { id: "host-dashboard", label: "My Matches", href: "/dashboard/host/matches", icon: Shield, roles: [UserRole.HOST] },
      { id: "host-create", label: "Create Match", href: "/dashboard/host/create-match", icon: ClipboardList, roles: [UserRole.HOST] },
    ],
  },
];

export const accountItems: NavItem[] = [
  { id: "profile", label: "Profile", action: "profile", icon: User, roles: rolesAll },
  { id: "logout", label: "Logout", action: "logout", icon: LogOut, roles: rolesAll },
];

export const filterSectionsByRole = (role?: UserRole | null) => {
  if (!role) return [];
  return sidebarSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);
};

export const filterAccountItemsByRole = (role?: UserRole | null) =>
  role ? accountItems.filter((item) => !item.roles || item.roles.includes(role)) : [];
