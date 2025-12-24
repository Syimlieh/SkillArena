import crypto from "crypto";
import { getEnv } from "@/lib/env";
import { SECURITY } from "@/lib/constants";
import { UserRole } from "@/enums/UserRole.enum";

export const verifyRole = (req: Request, allowed: UserRole[]): boolean => {
  const role = req.headers.get(SECURITY.authHeader);
  return !!role && allowed.includes(role as UserRole);
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
