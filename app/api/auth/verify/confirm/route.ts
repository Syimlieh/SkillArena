import { errorResponse, successResponse } from "@/lib/api-response";
import { EmailVerificationError, verifyEmailWithToken } from "@/modules/auth/email-verification.service";
import { z } from "zod";

const verifySchema = z.object({
  token: z.string().min(10),
});

export const POST = async (req: Request) => {
  const body = await req.json().catch(() => ({}));
  const parsed = verifySchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid verification payload", 400, {
      code: "INVALID_INPUT",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    await verifyEmailWithToken(parsed.data.token);
    return successResponse({ message: "Email verified successfully." });
  } catch (error) {
    if (error instanceof EmailVerificationError) {
      return errorResponse(error.message, error.statusCode, { code: "VERIFY_FAILED" });
    }
    return errorResponse("Unable to verify email", 500, { code: "SERVER_ERROR" });
  }
};
