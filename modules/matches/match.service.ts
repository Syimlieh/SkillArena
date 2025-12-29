import { connectDb } from "@/lib/db";
import { MATCH_DEFAULTS } from "@/lib/constants";
import { toSlug } from "@/lib/helpers/slug";
import { MatchModel } from "@/models/Match.model";
import { generateMatchId } from "@/modules/matches/match.id";
import { MatchInput } from "@/modules/matches/match.validator";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { Match } from "@/types/match.types";
import { MatchType } from "@/enums/MatchType.enum";
import { UserRole } from "@/enums/UserRole.enum";
import { AuthContext } from "@/lib/auth.server";

const buildTitle = (input: MatchInput, matchId: string): string => {
  if (input.title) return input.title;
  const mapLabel = input.map;
  const start = new Date(`${input.startDate}T${input.startTime}:00`);
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

export const createMatch = async (input: MatchInput, actor: AuthContext): Promise<Match> => {
  await connectDb();
  const startTime = new Date(`${input.startDate}T${input.startTime}:00`);
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
    type: actor.role === UserRole.ADMIN ? MatchType.OFFICIAL : MatchType.COMMUNITY,
    createdBy: actor.userId,
  });

  return doc.toObject();
};

export const listMatches = async (status?: MatchStatus, createdBy?: string): Promise<Match[]> => {
  await connectDb();
  const query: Record<string, any> = {};
  if (status) query.status = status;
  if (createdBy) query.createdBy = createdBy;
  const matches = await MatchModel.find(query).sort({ startTime: 1 }).lean<Match[]>();
  return matches as Match[];
};

export const getMatchBySlug = async (slug?: string | null): Promise<Match | null> => {
  if (!slug) return null;
  await connectDb();
  const normalizedSlug = slug.toLowerCase();
  const normalizedId = slug.toUpperCase();

  const bySlug = await MatchModel.findOne({ slug: normalizedSlug }).lean<Match>();
  if (bySlug) return bySlug;

  // allow direct matchId lookup regardless of casing
  const byId = await MatchModel.findOne({
    matchId: { $in: [slug, normalizedId, slug.toUpperCase()] },
  }).lean<Match>();
  return byId ?? null;
};
