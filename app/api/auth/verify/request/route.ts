import { headers } from "next/headers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUser } from "@/lib/auth.server";
import { EmailVerificationError, requestEmailVerification } from "@/modules/auth/email-verification.service";

export const POST = async (req: Request) => {
  try {
    const user = await requireUser();
    const hdrs = await headers();
    const origin = hdrs.get("origin") ?? new URL(req.url).origin;
    await requestEmailVerification(user.userId, origin);
    return successResponse({ message: "Verification email sent." });
  } catch (error: any) {
    if (error instanceof EmailVerificationError) {
      return errorResponse(error.message, error.statusCode);
    }
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse("Unable to send verification email", 500, { code: "SERVER_ERROR" });
  }
};
