import { NextRequest } from "next/server";
import { handleRejectHostApplication } from "@/modules/host/host.controller";

export const PATCH = (req: NextRequest, context: { params: Promise<{ id: string }> }) =>
  handleRejectHostApplication(req, context.params);
