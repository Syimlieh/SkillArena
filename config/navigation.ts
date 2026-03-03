import { UserRole } from "@/enums/UserRole.enum";
import { LayoutDashboard, BookOpen, ListChecks, Shield, ClipboardList, Users, User, LogOut, BarChart3, Swords, Inbox, History, Trophy, CalendarCheck } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  roles?: UserRole[];
  action?: "profile" | "logout";
  exactMatch?: boolean;
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
};

export const topNavItems: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: LayoutDashboard },
  { id: "guide", label: "How To", href: "/guide", icon: BookOpen },
];

const rolesAll = [UserRole.USER, UserRole.HOST, UserRole.ADMIN];

export const sidebarSections: NavSection[] = [
  {
    id: "player",
    label: "Player",
    items: [
      { id: "dashboard", label: "Overview", href: "/dashboard", icon: BarChart3, roles: [UserRole.USER, UserRole.HOST], exactMatch: true },
      { id: "my-matches", label: "My Matches", href: "/dashboard/my-matches", icon: CalendarCheck, roles: [UserRole.USER, UserRole.HOST] },
      { id: "available-matches", label: "Available", href: "/dashboard/available", icon: Swords, roles: [UserRole.USER, UserRole.HOST] },
      { id: "match-history", label: "History", href: "/dashboard/history", icon: History, roles: [UserRole.USER, UserRole.HOST] },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    items: [
      { id: "admin-overview", label: "Overview", href: "/dashboard/admin", icon: BarChart3, roles: [UserRole.ADMIN], exactMatch: true },
      { id: "admin-matches", label: "Matches", href: "/dashboard/admin/matches", icon: Swords, roles: [UserRole.ADMIN] },
      { id: "admin-match-requests", label: "Match Requests", href: "/dashboard/admin/match-requests", icon: Inbox, roles: [UserRole.ADMIN] },
      { id: "admin-match-history", label: "Match History", href: "/dashboard/admin/match-history", icon: History, roles: [UserRole.ADMIN] },
      { id: "admin-host-apps", label: "Host Applications", href: "/dashboard/admin/host-applications", icon: Users, roles: [UserRole.ADMIN] },
      { id: "admin-create-match", label: "Create Match", href: "/dashboard/admin/create-match", icon: ClipboardList, roles: [UserRole.ADMIN] },
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
  { id: "rules", label: "Rules", href: "/rules", icon: BookOpen, roles: rolesAll },
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
