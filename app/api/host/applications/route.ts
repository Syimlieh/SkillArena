import { NextRequest } from "next/server";
import { handleListHostApplications } from "@/modules/host/host.controller";
import { withApiLogger } from "@/lib/api-logger";

export const GET = withApiLogger("api-host-applications", "GET", async (req: NextRequest) =>
  handleListHostApplications(req)
);
