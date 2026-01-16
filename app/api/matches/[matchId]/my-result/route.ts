import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireUser } from "@/lib/auth.server";
import { connectDb } from "@/lib/db";
import { MatchResultSubmissionModel } from "@/models/MatchResultSubmission.model";
import { getMatchBySlug } from "@/modules/matches/match.service";
import { FileMetadataModel } from "@/models/FileMetadata.model";
import { createPresignedDownload } from "@/lib/spaces";
import { FileType } from "@/types/file.types";

export const dynamic = "force-dynamic";

export const GET = async (_req: NextRequest, { params }: { params: Promise<{ matchId: string }> }) => {
  try {
    const user = await requireUser();
    await connectDb();
    const { matchId } = await params;
    const match = await getMatchBySlug(matchId, user.userId);
    if (!match) {
      return errorResponse("Match not found", 404);
    }

    const submission = await MatchResultSubmissionModel.findOne({ userId: user.userId, matchId: match.matchId }).lean();
    if (!submission) {
      return errorResponse("No submission found", 404);
    }

    let screenshotUrl = submission.screenshotUrl;
    if (submission.fileId) {
      const fileMeta = await FileMetadataModel.findOne({ fileId: submission.fileId }).lean();
      if (fileMeta?.publicId && fileMeta.type === FileType.RESULT_SCREENSHOT) {
        screenshotUrl = await createPresignedDownload(fileMeta.publicId, 300);
      } else if (fileMeta?.url) {
        screenshotUrl = fileMeta.url;
      }
    }

    return successResponse({
      submission: {
        status: submission.status,
        screenshotUrl,
        submittedAt: submission.createdAt ?? new Date().toISOString(),
        hostApproved: submission.hostApproved,
        hostRejected: submission.hostRejected,
        hostRejectReason: submission.hostRejectReason,
        hostApprovedAt: submission.hostApprovedAt,
        hostApprovedBy: submission.hostApprovedBy,
        adminRejectReason: submission.adminRejectReason,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    if (message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    return errorResponse("Unable to load submission", 500);
  }
};
