import crypto from "crypto";
import { getEnv } from "@/lib/env";
import { SECURITY } from "@/lib/constants";
import { UserRole } from "@/enums/UserRole.enum";
import { verifyAuthToken } from "@/modules/auth/auth.service";

const parseCookies = (cookieHeader: string | null): Record<string, string> => {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    acc[key] = rest.join("=");
    return acc;
  }, {});
};

const extractBearerToken = (req: Request): string | null => {
  const header = req.headers.get(SECURITY.authHeader);
  if (header?.startsWith(SECURITY.bearerPrefix)) {
    return header.slice(SECURITY.bearerPrefix.length).trim();
  }
  const cookies = parseCookies(req.headers.get("cookie"));
  return cookies[SECURITY.authCookie] ?? null;
};

export const verifyRole = (req: Request, allowed: UserRole[]): boolean => {
  const token = extractBearerToken(req);
  if (!token) return false;
  const payload = verifyAuthToken(token);
  return !!payload && allowed.includes(payload.role);
};

export const verifySignature = (req: Request, rawBody: string): boolean => {
  const signatureHeader = req.headers.get(SECURITY.webhookSecretHeader);
  if (!signatureHeader) return false;
  const { PHONEPE_WEBHOOK_SECRET } = getEnv();
  const expected = crypto
    .createHmac("sha256", PHONEPE_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  const received = Buffer.from(signatureHeader);
  const expectedBuffer = Buffer.from(expected);
  if (received.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(received, expectedBuffer);
};
