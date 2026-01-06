export const BRAND = {
  name: "BGMI Scrims",
  accent: "#42ff87",
  secondary: "#0f172a",
};

export const SECURITY = {
  webhookSecretHeader: "x-phonepe-signature",
  authHeader: "authorization",
  authCookie: "sa_auth",
  bearerPrefix: "Bearer ",
};

export const API_ROUTES = {
  scrims: "/api/scrims",
  payments: "/api/payments",
  phonepeWebhook: "/api/webhooks/phonepe",
  authLogin: "/api/auth/login",
  authRegister: "/api/auth/register",
  authResetRequest: "/api/auth/reset/request",
  authResetConfirm: "/api/auth/reset/confirm",
  adminMatches: "/api/admin/matches",
  hostMatches: "/api/host/matches",
  profile: "/api/profile",
} as const;

export const MATCH_DEFAULTS = {
  entryFee: 80,
  maxSlots: 25,
  prizes: { first: 1370, second: 150, third: 80 },
} as const;
