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
} as const;
