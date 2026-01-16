import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth.server";
import { connectDb } from "@/lib/db";
import { MatchResultSubmissionModel } from "@/models/MatchResultSubmission.model";
import { FileMetadataModel } from "@/models/FileMetadata.model";
import { createPresignedDownload } from "@/lib/spaces";
import { FileType } from "@/types/file.types";
import { ResultStatus } from "@/enums/ResultStatus.enum";
// Match closing is handled by a separate endpoint; this route only updates the submission.

const placementPoints: Record<number, number> = {
  1: 15,
  2: 12,
  3: 10,
  4: 8,
  5: 6,
  6: 4,
  7: 2,
  8: 1,
};

const calculateScore = (placement?: number, kills?: number) => {
  const placementScore = placement && placement > 0 ? placementPoints[placement] ?? 0 : 0;
  const killScore = kills && kills > 0 ? kills : 0;
  return placementScore + killScore;
};

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ matchId: string; submissionId: string }> }) => {
  try {
    const admin = await requireAdmin();
    await connectDb();
    const { submissionId, matchId } = await params;
    const body = await req.json();
    const placement = typeof body.placement === "number" ? body.placement : undefined;
    const kills = typeof body.kills === "number" ? body.kills : undefined;
    const status = body.status as ResultStatus | undefined;

    const doc = await MatchResultSubmissionModel.findOne({ _id: submissionId, matchId });
    if (!doc) return errorResponse("Submission not found", 404);

    if (placement !== undefined) doc.placement = placement;
    if (kills !== undefined) doc.kills = kills;
    if (status && Object.values(ResultStatus).includes(status)) {
      doc.status = status;
    }
    doc.totalScore = calculateScore(doc.placement, doc.kills);
    doc.reviewerId = admin.userId;
    await doc.save();

    let screenshotUrl = doc.screenshotUrl;
    if (doc.fileId) {
      const fileMeta = await FileMetadataModel.findOne({ fileId: doc.fileId }).lean();
      if (fileMeta?.publicId && fileMeta.type === FileType.RESULT_SCREENSHOT) {
        screenshotUrl = await createPresignedDownload(fileMeta.publicId, 300);
      } else if (fileMeta?.url) {
        screenshotUrl = fileMeta.url;
      }
    }

    const responsePayload: any = {
      submission: {
        submissionId: doc._id?.toString(),
        status: doc.status,
        screenshotUrl,
        submittedAt: doc.createdAt ?? new Date().toISOString(),
        placement: doc.placement,
        kills: doc.kills,
        totalScore: doc.totalScore,
        userId: doc.userId,
      },
    };

    return successResponse(responsePayload);
  } catch (err: any) {
    if (err?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (err?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to update submission", 500);
  }
};
