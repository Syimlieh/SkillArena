import { NextRequest } from "next/server";
import { handleRegisterMatch } from "@/modules/registrations/registration.controller";

export const POST = (req: NextRequest, context: { params: Promise<{ matchId: string }> }) =>
  handleRegisterMatch(req, context.params);
