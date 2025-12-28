import { NextRequest } from "next/server";
import { handleApproveHostApplication } from "@/modules/host/host.controller";

export const PATCH = (req: NextRequest, context: { params: Promise<{ id: string }> }) =>
  handleApproveHostApplication(req, context.params);
