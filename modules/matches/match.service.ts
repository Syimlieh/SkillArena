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
import { RegistrationModel } from "@/models/Registration.model";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { MatchResultSubmissionModel } from "@/models/MatchResultSubmission.model";
import { ResultStatus } from "@/enums/ResultStatus.enum";

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

  const matchIds = matches.map((m) => m.matchId);
  if (matchIds.length === 0) return matches as Match[];

  const regCounts = await RegistrationModel.aggregate<{ _id: string; count: number }>([
    { $match: { matchId: { $in: matchIds }, status: { $in: [RegistrationStatus.PENDING_PAYMENT, RegistrationStatus.CONFIRMED] } } },
    { $group: { _id: "$matchId", count: { $sum: 1 } } },
  ]);
  const pendingResults = await MatchResultSubmissionModel.aggregate<{ _id: string; count: number }>([
    { $match: { matchId: { $in: matchIds }, status: { $in: [ResultStatus.SUBMITTED, ResultStatus.UNDER_REVIEW] } } },
    { $group: { _id: "$matchId", count: { $sum: 1 } } },
  ]);

  const regCountMap = new Map<string, number>(regCounts.map((c) => [c._id, c.count]));
  const pendingResultMap = new Map<string, number>(pendingResults.map((c) => [c._id, c.count]));

  return matches.map((m) => ({
    ...m,
    registrationCount: regCountMap.get(m.matchId) ?? 0,
    pendingResultCount: pendingResultMap.get(m.matchId) ?? 0,
  })) as Match[];
};

export const getMatchBySlug = async (slug?: string | null, userId?: string | null): Promise<(Match & { isRegistered?: boolean }) | null> => {
  if (!slug) return null;
  await connectDb();
  const normalizedSlug = slug.toLowerCase();
  const normalizedId = slug.toUpperCase();

  const attachCount = async (match: Match | null) => {
    if (!match) return null;
    const registrationCount = await RegistrationModel.countDocuments({
      matchId: match.matchId,
      status: { $in: [RegistrationStatus.PENDING_PAYMENT, RegistrationStatus.CONFIRMED] },
    });
    const pendingResultCount = await MatchResultSubmissionModel.countDocuments({
      matchId: match.matchId,
      status: { $in: [ResultStatus.SUBMITTED, ResultStatus.UNDER_REVIEW] },
    });
    let isRegistered: boolean | undefined;
    if (userId) {
      const registration = await RegistrationModel.findOne({
        userId,
        matchId: match.matchId,
        status: { $in: [RegistrationStatus.PENDING_PAYMENT, RegistrationStatus.CONFIRMED] },
      }).lean();
      isRegistered = !!registration;
    }
    return { ...match, registrationCount, pendingResultCount, isRegistered };
  };

  const bySlug = await MatchModel.findOne({ slug: normalizedSlug }).lean<Match>();
  if (bySlug) return attachCount(bySlug);

  // allow direct matchId lookup regardless of casing
  const byId = await MatchModel.findOne({
    matchId: { $in: [slug, normalizedId, slug.toUpperCase()] },
  }).lean<Match>();
  return attachCount(byId);
};

export const startMatch = async (matchId: string, actor: AuthContext): Promise<Match | null> => {
  await connectDb();
  const normalizedId = matchId.toUpperCase();
  const match = await MatchModel.findOne({ matchId: { $in: [matchId, normalizedId, matchId.toLowerCase()] } }).lean<Match>();
  if (!match) return null;
  const isOwner = match.createdBy === actor.userId;
  const isAdmin = actor.role === UserRole.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new Error("Forbidden");
  }
  if (match.status !== MatchStatus.UPCOMING) {
    return match;
  }
  await MatchModel.updateOne({ matchId: match.matchId }, { $set: { status: MatchStatus.ONGOING } });
  return { ...match, status: MatchStatus.ONGOING };
};
