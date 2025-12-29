import { NextRequest } from "next/server";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { requireAdmin, requireMatchCreator } from "@/lib/auth.server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { createMatch, listMatches } from "@/modules/matches/match.service";
import { matchSchema } from "@/modules/matches/match.validator";

export const handleCreateMatch = async (req: NextRequest) => {
  try {
    const actor = await requireMatchCreator();
    const body = await req.json();
    const parsed = matchSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid match payload", 400, {
        code: "INVALID_INPUT",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
    }

    const match = await createMatch(parsed.data, actor);
    return successResponse({ match }, { status: 201 });
  } catch (error: any) {
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to create match", 500);
  }
};

export const handleListMatches = async (req: NextRequest) => {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status") as MatchStatus | null;
    const matches = await listMatches(statusParam ?? undefined);
    return successResponse({ matches });
  } catch (error: any) {
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to fetch matches", 500);
  }
};

export const handleListMatchesForCreator = async (req: NextRequest) => {
  try {
    const actor = await requireMatchCreator();
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status") as MatchStatus | null;
    const matches = await listMatches(statusParam ?? undefined, actor.userId);
    return successResponse({ matches });
  } catch (error: any) {
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to fetch matches", 500);
  }
};
