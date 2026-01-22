import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireMatchCreator } from "@/lib/auth.server";
import { startMatch } from "@/modules/matches/match.service";
import { withApiLogger } from "@/lib/api-logger";

export const dynamic = "force-dynamic";

export const POST = withApiLogger(
  "api-matches-start",
  "POST",
  async (req: NextRequest, { params }: { params: Promise<{ matchId: string }> }) => {
  try {
    const actor = await requireMatchCreator();
    const { matchId } = await params;
    if (!matchId) {
      return errorResponse("Match not found", 404);
    }
    const payload = await req.json().catch(() => ({}));
    const updated = await startMatch(matchId, actor, {
      roomId: typeof payload?.roomId === "string" ? payload.roomId : undefined,
      roomPassword: typeof payload?.roomPassword === "string" ? payload.roomPassword : undefined,
      message: typeof payload?.message === "string" ? payload.message : undefined,
      origin: req.headers.get("origin") ?? `${req.headers.get("x-forwarded-proto") || "https"}://${req.headers.get("host") || ""}`,
    });
    if (!updated) {
      return errorResponse("Match not found", 404);
    }
    return successResponse({ match: updated });
  } catch (err: any) {
    if (err?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (err?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to start match", 500);
  }
  }
);
