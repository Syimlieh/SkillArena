import { NextRequest } from "next/server";
import { handleRejectHostApplication } from "@/modules/host/host.controller";
import { withApiLogger } from "@/lib/api-logger";

export const PATCH = withApiLogger(
  "api-host-applications-reject",
  "PATCH",
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) =>
    handleRejectHostApplication(req, context.params)
);
