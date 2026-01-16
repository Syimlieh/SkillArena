import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUser } from "@/lib/auth.server";
import { createMatchRequestSchema } from "@/modules/match-requests/match-request.validator";
import {
  createMatchRequest,
  listMatchRequests,
  MatchRequestError,
} from "@/modules/match-requests/match-request.service";

export const GET = async () => {
  let userId: string | undefined;
  try {
    const user = await requireUser();
    userId = user.userId;
  } catch {
    userId = undefined;
  }

  try {
    const requests = await listMatchRequests({ userId });
    return successResponse({ requests });
  } catch {
    return errorResponse("Unable to load match requests", 500);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = createMatchRequestSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid request payload", 400, {
        code: "INVALID_INPUT",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
    }
    const created = await createMatchRequest(user.userId, parsed.data);
    return successResponse(
      {
        request: {
          id: created._id?.toString?.() ?? "",
          map: created.map,
          matchType: created.matchType,
          preferredTimeRange: created.preferredTimeRange,
          entryFeeRange: created.entryFeeRange,
          note: created.note,
          status: created.status,
          createdAt: created.createdAt?.toString?.() ?? new Date().toISOString(),
          voteCount: 0,
          hasVoted: false,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof MatchRequestError) {
      return errorResponse(error.message, error.statusCode);
    }
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse("Unable to create match request", 500);
  }
};
