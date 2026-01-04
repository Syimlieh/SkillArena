import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth.server";
import { connectDb } from "@/lib/db";
import { MatchResultSubmissionModel } from "@/models/MatchResultSubmission.model";
import { ResultStatus } from "@/enums/ResultStatus.enum";
import { closeMatchWithWinner } from "@/modules/matches/match.service";

export const dynamic = "force-dynamic";

export const POST = async (_req: NextRequest, { params }: { params: { matchId: string } }) => {
  try {
    const admin = await requireAdmin();
    await connectDb();
    const { matchId } = params;
    if (!matchId) return errorResponse("Match not found", 404);

    const total = await MatchResultSubmissionModel.countDocuments({ matchId }).lean();
    const verifiedCount = await MatchResultSubmissionModel.countDocuments({ matchId, status: ResultStatus.VERIFIED }).lean();
    if (total === 0 || verifiedCount === 0) {
      return errorResponse("No verified submission to declare as winner.", 400);
    }
    if (verifiedCount !== total) {
      return errorResponse("All submissions must be verified before closing the match.", 400);
    }

    const topVerified = await MatchResultSubmissionModel.findOne({ matchId, status: ResultStatus.VERIFIED })
      .sort({ totalScore: -1, kills: -1, placement: 1, createdAt: 1 })
      .lean();

    if (!topVerified) {
      return errorResponse("No verified submission to declare as winner.", 400);
    }

    const closed = await closeMatchWithWinner(matchId, topVerified._id?.toString() ?? "", admin);
    if (!closed) return errorResponse("Match not found", 404);

    return successResponse({ match: closed });
  } catch (err: any) {
    if (err?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (err?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to close match", 500);
  }
};
