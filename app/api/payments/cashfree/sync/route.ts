import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth.server";
import { createModuleLogger } from "@/lib/logger";
import { syncStaleCashfreeOrders } from "@/modules/payments/cashfree.service";

const { logInfo, logWarn, logError } = createModuleLogger("cashfree-sync");

const parseNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const POST = async (req: NextRequest) => {
  try {
    logInfo("sync: request received");
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const minAgeMinutes = parseNumber(searchParams.get("minAgeMinutes"), 10);
    const limit = parseNumber(searchParams.get("limit"), 50);

    if (minAgeMinutes < 1 || minAgeMinutes > 24 * 60) {
      logWarn("sync: invalid minAgeMinutes", { minAgeMinutes });
      return errorResponse("minAgeMinutes must be between 1 and 1440", 400);
    }
    if (limit < 1 || limit > 200) {
      logWarn("sync: invalid limit", { limit });
      return errorResponse("limit must be between 1 and 200", 400);
    }

    logInfo("sync: start", { minAgeMinutes, limit });
    const result = await syncStaleCashfreeOrders({ minAgeMinutes, limit });
    logInfo("sync: completed", {
      processed: result.processed,
      resolved: result.resolved,
      failed: result.failed,
    });
    return successResponse(result);
  } catch (error: any) {
    logError("sync: failed", { message: error?.message });
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse(error?.message || "Unable to sync cashfree orders", 500);
  }
};
