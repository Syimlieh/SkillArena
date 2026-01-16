import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUser } from "@/lib/auth.server";
import { connectDb } from "@/lib/db";
import { getMatchBySlug } from "@/modules/matches/match.service";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { RegistrationModel } from "@/models/Registration.model";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { MatchResultSubmissionModel } from "@/models/MatchResultSubmission.model";
import { ResultStatus } from "@/enums/ResultStatus.enum";
import { FileMetadataModel } from "@/models/FileMetadata.model";
import { createPresignedDownload } from "@/lib/spaces";
import { FileType } from "@/types/file.types";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest, { params }: { params: Promise<{ matchId: string }> }) => {
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

    const body = await req.json().catch(() => null);
    const fileId = body?.fileId as string | undefined;
    if (!fileId) {
      return errorResponse("Screenshot fileId is required.", 400);
    }

    const fileMeta = await FileMetadataModel.findOne({ fileId }).lean();
    if (!fileMeta) {
      return errorResponse("Uploaded screenshot not found.", 400);
    }

    const doc = await MatchResultSubmissionModel.create({
      userId: user.userId,
      matchId: match.matchId,
      screenshotUrl: fileMeta.url,
      fileId,
      teamName: registration.teamName,
      status: ResultStatus.SUBMITTED,
    });
    const signedUrl =
      fileMeta.type === FileType.RESULT_SCREENSHOT
        ? await createPresignedDownload(fileMeta.publicId, 300)
        : fileMeta.url;

    return successResponse(
      {
        submission: {
          submissionId: doc._id?.toString(),
          status: doc.status,
          screenshotUrl: signedUrl,
          submittedAt: doc.createdAt ?? new Date().toISOString(),
          fileId,
          hostApproved: doc.hostApproved,
          hostRejected: doc.hostRejected,
          hostRejectReason: doc.hostRejectReason,
          hostApprovedAt: doc.hostApprovedAt,
          hostApprovedBy: doc.hostApprovedBy,
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
