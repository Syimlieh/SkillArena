import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth.server";
import { listMatchRequests } from "@/modules/match-requests/match-request.service";
import { withApiLogger } from "@/lib/api-logger";

export const GET = withApiLogger("api-admin-match-requests", "GET", async () => {
  try {
    await requireAdmin();
    const requests = await listMatchRequests({ includeVoters: true });
    return successResponse({ requests });
  } catch (error: any) {
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to load match requests", 500);
  }
});
