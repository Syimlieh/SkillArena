import { NextRequest } from "next/server";
import { handleAdminRegisterMatch } from "@/modules/registrations/registration.controller";
import { withApiLogger } from "@/lib/api-logger";

export const POST = withApiLogger(
  "api-admin-matches-register",
  "POST",
  async (req: NextRequest, context: { params: Promise<{ matchId: string }> }) =>
    handleAdminRegisterMatch(req, context.params)
);
