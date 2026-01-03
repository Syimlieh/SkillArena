import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUser } from "@/lib/auth.server";
import { connectDb } from "@/lib/db";
import { getMatchBySlug } from "@/modules/matches/match.service";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { RegistrationModel } from "@/models/Registration.model";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { MatchResultSubmissionModel } from "@/models/MatchResultSubmission.model";
import { saveImageUpload } from "@/lib/upload";
import { ResultStatus } from "@/enums/ResultStatus.enum";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest, { params }: { params: { matchId: string } }) => {
  try {
    const user = await requireUser();
    await connectDb();

    const { matchId } = await params;
    const match = await getMatchBySlug(matchId, user.userId);
    if (!match) {
      return errorResponse("Match not found", 404);
    }

    if (![MatchStatus.ONGOING, MatchStatus.AWAITING_RESULTS].includes(match.status)) {
      return errorResponse("Result submission is not open for this match.", 400);
    }

    const registration = await RegistrationModel.findOne({
      userId: user.userId,
      matchId: match.matchId,
      status: { $in: [RegistrationStatus.PENDING_PAYMENT, RegistrationStatus.CONFIRMED] },
    }).lean();

    if (!registration) {
      return errorResponse("You must be registered for this match to submit results.", 403);
    }

    const existing = await MatchResultSubmissionModel.findOne({ userId: user.userId, matchId: match.matchId }).lean();
    if (existing) {
      return errorResponse("Result already submitted for this match.", 409);
    }

    const formData = await req.formData();
    const file = formData.get("screenshot");
    if (!(file instanceof File)) {
      return errorResponse("Screenshot is required.", 400);
    }

    let screenshotUrl: string;
    try {
      screenshotUrl = await saveImageUpload(file, "results");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid upload.";
      return errorResponse(message, 400);
    }

    const doc = await MatchResultSubmissionModel.create({
      userId: user.userId,
      matchId: match.matchId,
      screenshotUrl,
      status: ResultStatus.SUBMITTED,
    });

    return successResponse(
      {
        submission: {
          status: doc.status,
          screenshotUrl: doc.screenshotUrl,
          submittedAt: doc.createdAt ?? new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    if (message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    return errorResponse("Unable to submit result", 500);
  }
};
