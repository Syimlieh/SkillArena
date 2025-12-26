import { NextResponse } from "next/server";
import { SECURITY } from "@/lib/constants";
import { successResponse, errorResponse } from "@/lib/api-response";
import { AuthServiceError, loginUser } from "@/modules/auth/auth.service";
import { loginSchema } from "@/modules/auth/auth.validator";

const buildAuthCookie = (token: string) => ({
  name: SECURITY.authCookie,
  value: token,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

export const POST = async (req: Request) => {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid credentials payload", 400, {
      code: "INVALID_INPUT",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const { user, token } = await loginUser(parsed.data);
    const response = successResponse({ user }, { status: 200 });
    response.cookies.set(buildAuthCookie(token));
    return response;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return errorResponse(error.message, error.statusCode, { code: "AUTH_ERROR" });
    }
    return errorResponse("Unable to login", 500, { code: "SERVER_ERROR" });
  }
};
