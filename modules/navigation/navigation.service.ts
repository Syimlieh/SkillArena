import { AppRoute, buildScrimDetailRoute } from "@/lib/routes";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UserRole } from "@/enums/UserRole.enum";

const buildLoginRedirect = (redirectTo: string) =>
  `${AppRoute.LOGIN}?redirect=${encodeURIComponent(redirectTo)}`;

const pushSafely = (router: AppRouterInstance, path: string) => router.push(path);

export const NavigationService = {
  toHome: (router: AppRouterInstance) => pushSafely(router, AppRoute.HOME),
  toLoginWithRedirect: (router: AppRouterInstance, redirectTo: string) =>
    pushSafely(router, buildLoginRedirect(redirectTo)),
  toSchedule: (router: AppRouterInstance) => pushSafely(router, AppRoute.TOURNAMENTS),
  toMyMatches: (router: AppRouterInstance) => pushSafely(router, AppRoute.DASHBOARD_MY_MATCHES),
  toScrimDetail: (router: AppRouterInstance, slug: string) =>
    pushSafely(router, buildScrimDetailRoute(slug)),
};

export const handleAuthRedirect = (
  router: AppRouterInstance,
  isAuthenticated: boolean,
  targetPath: string
) => {
  if (!isAuthenticated) {
    NavigationService.toLoginWithRedirect(router, targetPath);
    return;
  }
  pushSafely(router, targetPath);
};

export const resolveDashboardRoute = (role?: UserRole): string =>
  role === UserRole.ADMIN ? "/dashboard/admin" : "/dashboard";
