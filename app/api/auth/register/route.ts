import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { SECURITY } from "@/lib/constants";
import { successResponse, errorResponse } from "@/lib/api-response";
import { AuthServiceError, registerUser } from "@/modules/auth/auth.service";
import { registerSchema } from "@/modules/auth/auth.validator";
import { withApiLogger } from "@/lib/api-logger";

const buildAuthCookie = (token: string) => ({
  name: SECURITY.authCookie,
  value: token,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days, aligned with default JWT expiry
});

export const POST = withApiLogger("api-auth-register", "POST", async (req: Request) => {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid registration data", 400, {
      code: "INVALID_INPUT",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const hdrs = await headers();
    const origin = hdrs.get("origin") ?? new URL(req.url).origin;
    const { user, token } = await registerUser(parsed.data, origin);
    const response = successResponse({ user }, { status: 201 });
    response.cookies.set(buildAuthCookie(token));
    return response;
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return errorResponse(error.message, error.statusCode, {
        code: "AUTH_ERROR",
        fieldErrors: error.fieldErrors,
      });
    }
    return errorResponse("Unable to complete registration", 500, { code: "SERVER_ERROR" });
  }
});
