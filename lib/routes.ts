export enum AppRoute {
  HOME = "/",
  LOGIN = "/auth/login",
  FORGOT_PASSWORD = "/auth/forgot",
  RESET_PASSWORD = "/auth/reset",
  TOURNAMENTS = "/tournaments",
  DASHBOARD_MY_MATCHES = "/dashboard/my-matches",
  SCRIMS = "/scrims",
  MATCHES = "/matches",
}

export const buildScrimDetailRoute = (slug: string) => `${AppRoute.SCRIMS}/${slug}`;
export const buildMatchDetailRoute = (slug: string) => `${AppRoute.MATCHES}/${slug}`;
