import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUser } from "@/lib/auth.server";
import { connectDb } from "@/lib/db";
import { MatchResultSubmissionModel } from "@/models/MatchResultSubmission.model";
import { MatchModel } from "@/models/Match.model";
import { UserRole } from "@/enums/UserRole.enum";
import { withApiLogger } from "@/lib/api-logger";

export const PATCH = withApiLogger(
  "api-matches-submissions-host-approve",
  "PATCH",
  async (req: NextRequest, { params }: { params: Promise<{ matchId: string; submissionId: string }> }) => {
  try {
    const user = await requireUser();
    await connectDb();

    const { matchId, submissionId } = await params;
    const match = await MatchModel.findOne({ matchId }).lean();
    if (!match) return errorResponse("Match not found", 404);

    if (user.role !== UserRole.ADMIN && match.createdBy !== user.userId) {
      return errorResponse("Forbidden", 403);
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action === "reject" ? "reject" : "approve";
    const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
    if (action === "reject" && !reason) {
      return errorResponse("Rejection reason is required.", 400);
    }

    const now = new Date();
    const update =
      action === "approve"
        ? {
            hostApproved: true,
            hostRejected: false,
            hostRejectReason: undefined,
            hostApprovedAt: now,
            hostApprovedBy: user.userId,
          }
        : {
            hostApproved: false,
            hostRejected: true,
            hostRejectReason: reason,
            hostApprovedAt: now,
            hostApprovedBy: user.userId,
          };

    const doc = await MatchResultSubmissionModel.findOneAndUpdate(
      { _id: submissionId, matchId },
      { $set: update },
      { new: true }
    );
    if (!doc) return errorResponse("Submission not found", 404);

    return successResponse({
      submission: {
        submissionId: doc._id?.toString(),
        status: doc.status,
        screenshotUrl: doc.screenshotUrl,
        submittedAt: doc.createdAt ?? new Date().toISOString(),
        hostApproved: doc.hostApproved,
        hostRejected: doc.hostRejected,
        hostRejectReason: doc.hostRejectReason,
        hostApprovedAt: doc.hostApprovedAt,
        hostApprovedBy: doc.hostApprovedBy,
        adminRejectReason: doc.adminRejectReason,
        placement: doc.placement,
        kills: doc.kills,
        totalScore: doc.totalScore,
        userId: doc.userId,
      },
    });
  } catch (err: any) {
    if (err?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (err?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to update submission", 500);
  }
  }
);
