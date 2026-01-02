import { NextRequest } from "next/server";
import { handleAdminRegisterMatch } from "@/modules/registrations/registration.controller";

export const POST = (req: NextRequest, context: { params: Promise<{ matchId: string }> }) =>
  handleAdminRegisterMatch(req, context.params);
