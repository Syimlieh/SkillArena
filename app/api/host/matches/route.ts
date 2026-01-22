import { NextRequest } from "next/server";
import { handleCreateMatch, handleListMatchesForCreator } from "@/modules/matches/match.controller";
import { withApiLogger } from "@/lib/api-logger";

export const POST = withApiLogger("api-host-matches", "POST", async (req: NextRequest) =>
  handleCreateMatch(req)
);
export const GET = withApiLogger("api-host-matches", "GET", async (req: NextRequest) =>
  handleListMatchesForCreator(req)
);
