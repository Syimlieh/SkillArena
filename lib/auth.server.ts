import { cookies, headers } from "next/headers";
import { SECURITY } from "@/lib/constants";
import { verifyAuthToken } from "@/modules/auth/auth.service";
import { UserRole } from "@/enums/UserRole.enum";

export interface AuthContext {
  userId: string;
  role: UserRole;
  email: string;
  name?: string;
}

const extractToken = async (): Promise<string | null> => {
  const cookieStore = await Promise.resolve(cookies());
  let bearer: string | null = null;
  try {
    const headerList = await Promise.resolve(headers());
    bearer = typeof (headerList as any)?.get === "function" ? headerList.get(SECURITY.authHeader) : null;
  } catch {
    bearer = null;
  }
  if (bearer?.startsWith(SECURITY.bearerPrefix)) {
    return bearer.slice(SECURITY.bearerPrefix.length).trim();
  }
  const tokenCookie = cookieStore?.get?.(SECURITY.authCookie);
  return tokenCookie?.value ?? null;
};

export const requireAdmin = async (): Promise<AuthContext> => {
  const token = await extractToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  const payload = verifyAuthToken(token);
  if (!payload || payload.role !== UserRole.ADMIN) {
    throw new Error("Forbidden");
  }
  return { userId: payload.userId, role: payload.role, email: payload.email };
};

export const requireUser = async (): Promise<AuthContext> => {
  const token = await extractToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  const payload = verifyAuthToken(token);
  if (!payload) {
    throw new Error("Unauthorized");
  }
  return { userId: payload.userId, role: payload.role, email: payload.email };
};
