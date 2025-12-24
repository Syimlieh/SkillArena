export const BRAND = {
  name: "BGMI Scrims",
  accent: "#42ff87",
  secondary: "#0f172a",
};

export const SECURITY = {
  webhookSecretHeader: "x-phonepe-signature",
  authHeader: "x-user-role",
};

export const API_ROUTES = {
  scrims: "/api/scrims",
  payments: "/api/payments",
  phonepeWebhook: "/api/webhooks/phonepe",
} as const;
