import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUser } from "@/lib/auth.server";
import { matchRequestIdSchema } from "@/modules/match-requests/match-request.validator";
import {
  voteForMatchRequest,
  removeVoteForMatchRequest,
  MatchRequestError,
} from "@/modules/match-requests/match-request.service";

export const POST = async (_req: NextRequest, { params }: { params: Promise<{ requestId: string }> }) => {
  try {
    const user = await requireUser();
    const resolved = await params;
    const parsed = matchRequestIdSchema.safeParse(resolved);
    if (!parsed.success) {
      return errorResponse("Invalid request id", 400, {
        code: "INVALID_INPUT",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
    }
    const result = await voteForMatchRequest(user.userId, parsed.data.requestId);
    return successResponse(result);
  } catch (error: any) {
    if (error instanceof MatchRequestError) {
      return errorResponse(error.message, error.statusCode);
    }
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse("Unable to vote for request", 500);
  }
};

export const DELETE = async (_req: NextRequest, { params }: { params: Promise<{ requestId: string }> }) => {
  try {
    const user = await requireUser();
    const resolved = await params;
    const parsed = matchRequestIdSchema.safeParse(resolved);
    if (!parsed.success) {
      return errorResponse("Invalid request id", 400, {
        code: "INVALID_INPUT",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
    }
    const result = await removeVoteForMatchRequest(user.userId, parsed.data.requestId);
    return successResponse(result);
  } catch (error: any) {
    if (error instanceof MatchRequestError) {
      return errorResponse(error.message, error.statusCode);
    }
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse("Unable to remove vote", 500);
  }
};
