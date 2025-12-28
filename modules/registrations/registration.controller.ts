import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth.server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { registerMatchParamsSchema } from "@/modules/registrations/registration.validator";
import { registerForMatch, RegistrationError } from "@/modules/registrations/registration.service";

export const handleRegisterMatch = async (req: NextRequest, params: Promise<{ matchId: string }>) => {
  try {
    const user = await requireUser();
    const resolved = await params;
    const parsed = registerMatchParamsSchema.safeParse(resolved);
    if (!parsed.success) {
      return errorResponse("Invalid match id", 400, {
        code: "INVALID_INPUT",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await registerForMatch(parsed.data.matchId, user.userId);
    return successResponse(
      {
        registrationId: result.registration._id,
        match: {
          matchId: result.match.matchId,
          title: result.match.title,
          entryFee: result.match.entryFee,
          prizePool: result.match.prizePool,
          startTime: result.match.startTime,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof RegistrationError) {
      return errorResponse(error.message, error.statusCode, { code: "REGISTRATION_ERROR" });
    }
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to register for match", 500);
  }
};
