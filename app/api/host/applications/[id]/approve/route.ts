import { NextRequest } from "next/server";
import { handleApproveHostApplication } from "@/modules/host/host.controller";
import { withApiLogger } from "@/lib/api-logger";

export const PATCH = withApiLogger(
  "api-host-applications-approve",
  "PATCH",
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) =>
    handleApproveHostApplication(req, context.params)
);
