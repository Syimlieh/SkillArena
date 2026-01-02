import { NextRequest } from "next/server";
import { requireAdmin, requireUser } from "@/lib/auth.server";
import { errorResponse, successResponse } from "@/lib/api-response";
import {
  adminRegisterPayloadSchema,
  registerMatchParamsSchema,
} from "@/modules/registrations/registration.validator";
import {
  registerForMatch,
  RegistrationError,
  registerForMatchAsAdmin,
} from "@/modules/registrations/registration.service";

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

export const handleAdminRegisterMatch = async (req: NextRequest, params: Promise<{ matchId: string }>) => {
  try {
    const admin = await requireAdmin();
    const resolved = await params;
    const parsedParams = registerMatchParamsSchema.safeParse(resolved);
    if (!parsedParams.success) {
      return errorResponse("Invalid match id", 400, {
        code: "INVALID_INPUT",
        fieldErrors: parsedParams.error.flatten().fieldErrors,
      });
    }

    const body = await req.json();
    const parsedBody = adminRegisterPayloadSchema.safeParse(body);
    if (!parsedBody.success) {
      return errorResponse("Invalid payload", 400, {
        code: "INVALID_INPUT",
        fieldErrors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const result = await registerForMatchAsAdmin(
      parsedParams.data.matchId,
      parsedBody.data.userId,
      admin,
      {
        reference: parsedBody.data.paymentReference,
        amount: parsedBody.data.paymentAmount,
        method: parsedBody.data.paymentMethod,
        note: parsedBody.data.paymentNote,
      }
    );

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
        registration: result.registration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof RegistrationError) {
      return errorResponse(error.message, error.statusCode, { code: "REGISTRATION_ERROR" });
    }
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to register user for match", 500);
  }
};
