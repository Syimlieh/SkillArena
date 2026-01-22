import { headers } from "next/headers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { passwordResetRequestSchema } from "@/modules/auth/auth.validator";
import { PasswordResetError, requestPasswordReset } from "@/modules/auth/password-reset.service";
import { withApiLogger } from "@/lib/api-logger";

export const POST = withApiLogger("api-auth-reset-request", "POST", async (req: Request) => {
  const body = await req.json();
  const parsed = passwordResetRequestSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid email address", 400, {
      code: "INVALID_INPUT",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? new URL(req.url).origin;

  try {
    await requestPasswordReset(parsed.data.email, origin);
    return successResponse({ message: "If that email exists, a reset link is on its way." });
  } catch (error) {
    if (error instanceof PasswordResetError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse("Unable to start password reset", 500, { code: "SERVER_ERROR" });
  }
});
