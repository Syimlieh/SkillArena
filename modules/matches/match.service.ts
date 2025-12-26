import { connectDb } from "@/lib/db";
import { MATCH_DEFAULTS } from "@/lib/constants";
import { toSlug } from "@/lib/helpers/slug";
import { MatchModel } from "@/models/Match.model";
import { generateMatchId } from "@/modules/matches/match.id";
import { MatchInput } from "@/modules/matches/match.validator";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { Match } from "@/types/match.types";

const buildTitle = (input: MatchInput, matchId: string): string => {
  if (input.title) return input.title;
  const mapLabel = input.map;
  const start = new Date(`${input.startDate}T${input.startTime}:00Z`);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };
  const when = new Intl.DateTimeFormat("en-IN", options).format(start);
  return `${mapLabel} Scrim • ${when} • ${matchId}`;
};

export const createMatch = async (input: MatchInput, adminUserId: string): Promise<Match> => {
  await connectDb();
  const startTime = new Date(`${input.startDate}T${input.startTime}:00Z`);
  const { matchId, slug } = await generateMatchId(input.map, startTime);

  const prize = input.prizeBreakdown ?? MATCH_DEFAULTS.prizes;
  const prizePool = prize.first + prize.second + prize.third;

  const doc = await MatchModel.create({
    matchId,
    slug: toSlug(slug),
    map: input.map,
    title: buildTitle(input, matchId),
    startTime,
    entryFee: input.entryFee ?? MATCH_DEFAULTS.entryFee,
    maxSlots: input.maxSlots ?? MATCH_DEFAULTS.maxSlots,
    prizePool,
    prizeBreakdown: prize,
    status: input.status ?? MatchStatus.UPCOMING,
    createdBy: adminUserId,
  });

  return doc.toObject();
};

export const listMatches = async (status?: MatchStatus): Promise<Match[]> => {
  await connectDb();
  const query = status ? { status } : {};
  const matches = await MatchModel.find(query).sort({ startTime: 1 }).lean<Match>();
  return matches;
};
