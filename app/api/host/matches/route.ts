import { NextRequest } from "next/server";
import { handleCreateMatch, handleListMatchesForCreator } from "@/modules/matches/match.controller";

export const POST = (req: NextRequest) => handleCreateMatch(req);
export const GET = (req: NextRequest) => handleListMatchesForCreator(req);
