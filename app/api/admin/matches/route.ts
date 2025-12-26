import { NextRequest } from "next/server";
import { handleCreateMatch, handleListMatches } from "@/modules/matches/match.controller";

export const POST = (req: NextRequest) => handleCreateMatch(req);
export const GET = (req: NextRequest) => handleListMatches(req);
