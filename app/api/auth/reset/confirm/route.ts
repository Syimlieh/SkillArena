import { errorResponse, successResponse } from "@/lib/api-response";
import { passwordResetConfirmSchema } from "@/modules/auth/auth.validator";
import { PasswordResetError, resetPasswordWithToken } from "@/modules/auth/password-reset.service";
import { withApiLogger } from "@/lib/api-logger";

export const POST = withApiLogger("api-auth-reset-confirm", "POST", async (req: Request) => {
  const body = await req.json();
  const parsed = passwordResetConfirmSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid reset payload", 400, {
      code: "INVALID_INPUT",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    await resetPasswordWithToken(parsed.data.token, parsed.data.password);
    return successResponse({ message: "Password updated successfully." });
  } catch (error) {
    if (error instanceof PasswordResetError) {
      return errorResponse(error.message, error.statusCode, { code: "RESET_FAILED" });
    }
    return errorResponse("Unable to reset password", 500, { code: "SERVER_ERROR" });
  }
});
