import { NextRequest } from "next/server";
import { handleCreateMatch, handleListMatches } from "@/modules/matches/match.controller";
import { withApiLogger } from "@/lib/api-logger";

export const POST = withApiLogger("api-admin-matches", "POST", async (req: NextRequest) =>
  handleCreateMatch(req)
);
export const GET = withApiLogger("api-admin-matches", "GET", async (req: NextRequest) =>
  handleListMatches(req)
);
