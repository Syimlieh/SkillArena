import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth.server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { RegistrationModel } from "@/models/Registration.model";

export const POST = async (_req: NextRequest, { params }: { params: Promise<{ matchId: string; registrationId: string }> }) => {
  try {
    const admin = await requireAdmin();
    const { matchId, registrationId } = await params;
    if (!matchId || !registrationId) {
      return errorResponse("Registration not found", 404);
    }
    const updated = await RegistrationModel.findOneAndUpdate(
      { _id: registrationId, matchId },
      { $set: { lockedAt: new Date(), lockedBy: admin.userId } },
      { new: true }
    ).lean();
    if (!updated) {
      return errorResponse("Registration not found", 404);
    }
    return successResponse({ registrationId: updated._id?.toString(), lockedAt: updated.lockedAt });
  } catch (err: any) {
    if (err?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (err?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to lock registration", 500);
  }
};
