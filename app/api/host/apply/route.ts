import { NextRequest } from "next/server";
import { handleHostApply } from "@/modules/host/host.controller";
import { withApiLogger } from "@/lib/api-logger";

export const POST = withApiLogger("api-host-apply", "POST", async (req: NextRequest) =>
  handleHostApply(req)
);
