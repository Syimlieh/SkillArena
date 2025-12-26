export enum AppRoute {
  HOME = "/",
  LOGIN = "/auth/login",
  TOURNAMENTS = "/tournaments",
  DASHBOARD_MY_MATCHES = "/dashboard/my-matches",
  SCRIMS = "/scrims",
}

export const buildScrimDetailRoute = (slug: string) => `${AppRoute.SCRIMS}/${slug}`;
