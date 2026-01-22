import { NextRequest } from "next/server";
import { handleRegisterMatch } from "@/modules/registrations/registration.controller";
import { withApiLogger } from "@/lib/api-logger";

export const POST = withApiLogger(
  "api-matches-register",
  "POST",
  async (req: NextRequest, context: { params: Promise<{ matchId: string }> }) =>
    handleRegisterMatch(req, context.params)
);
