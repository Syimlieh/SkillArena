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
import { ACTIVE_REG_STATUSES } from "@/modules/registrations/registration.service";
import { UserModel } from "@/models/User.model";
import { FileMetadataModel } from "@/models/FileMetadata.model";

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

const serializeId = (id: any): string | undefined => {
  if (!id) return undefined;
  return typeof id === "string" ? id : id.toString();
};

const sanitizeMatch = <T extends Match>(match: T | null): T | null => {
  if (!match) return null;
  const winner = match.winner
    ? {
        ...match.winner,
        submissionId: serializeId((match.winner as any).submissionId),
        userId: serializeId((match.winner as any).userId),
      }
    : undefined;

  const matchResults = match.matchResults?.map((result: any) => {
    const { _id: unusedId, ...rest } = result ?? {};
    return {
      ...rest,
      teamId: serializeId(result?.teamId),
      userId: serializeId(result?.userId),
      submissionId: serializeId(result?.submissionId),
    };
  });

  return {
    ...match,
    _id: serializeId((match as any)._id),
    winner,
    matchResults,
  } as T;
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

  return matches.map((m) =>
    sanitizeMatch({
      ...m,
      registrationCount: regCountMap.get(m.matchId) ?? 0,
      pendingResultCount: pendingResultMap.get(m.matchId) ?? 0,
    }) as Match
  ) as Match[];
};

type RecentMatchResult = {
  matchId: string;
  slug?: string;
  map: string;
  title: string;
  startTime: Date | string;
  prizePool: number;
  winnerTeam?: string;
  winnerUserId?: string;
  winnerAvatarUrl?: string;
  winnerKills?: number;
  winnerPosition?: number;
  winnerTotalScore?: number;
};

export const listRecentMatchResults = async (limit = 6): Promise<RecentMatchResult[]> => {
  await connectDb();
  const matches = await MatchModel.find({
    status: MatchStatus.COMPLETED,
    winner: { $exists: true, $ne: null },
  })
    .sort({ startTime: -1 })
    .limit(limit)
    .lean<Match[]>();

  const winners = matches
    .map((match) => match.winner)
    .filter(Boolean) as { userId?: string; teamName?: string; submissionId?: string }[];
  const userIds = winners.map((winner) => winner.userId).filter(Boolean) as string[];
  const submissionIds = winners.map((winner) => winner.submissionId).filter(Boolean) as string[];

  const users = userIds.length ? await UserModel.find({ _id: { $in: userIds } }).lean() : [];
  const userMap = new Map(users.map((user: any) => [user._id?.toString?.() ?? "", user]));

  const avatarFileIds = users
    .map((user: any) => user.profileFileId)
    .filter(Boolean) as string[];
  const avatarFiles = avatarFileIds.length
    ? await FileMetadataModel.find({ fileId: { $in: avatarFileIds } }).lean()
    : [];
  const avatarMap = new Map(avatarFiles.map((file: any) => [file.fileId, file.url]));

  const submissions = submissionIds.length
    ? await MatchResultSubmissionModel.find({ _id: { $in: submissionIds } }).lean()
    : [];
  const submissionMap = new Map(submissions.map((sub: any) => [sub._id?.toString?.() ?? "", sub]));

  return matches.map((match) => {
    const winner = match.winner as { userId?: string; teamName?: string; submissionId?: string } | undefined;
    const winnerPosition = (match.winner as any)?.position;
    const winnerUserId = winner?.userId;
    const winnerUser = winnerUserId ? userMap.get(winnerUserId) : undefined;
    const winnerTeam = winner?.teamName || winnerUser?.name;
    const avatarUrl = winnerUser?.profileFileId ? avatarMap.get(winnerUser.profileFileId) : undefined;
    const submission = winner?.submissionId ? submissionMap.get(winner.submissionId) : undefined;
    return {
      matchId: match.matchId,
      slug: match.slug,
      map: match.map,
      title: match.title ?? match.matchId,
      startTime: match.startTime ?? new Date(),
      prizePool: match.prizePool ?? 0,
      winnerTeam: winnerTeam ?? "Winner",
      winnerUserId,
      winnerAvatarUrl: avatarUrl,
      winnerKills: submission?.kills,
      winnerPosition: typeof winnerPosition === "number" ? winnerPosition : undefined,
      winnerTotalScore: submission?.totalScore,
    };
  });
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
    const firstTeam = await RegistrationModel.findOne({ matchId: match.matchId }).lean();
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
    return sanitizeMatch({
      ...match,
      registrationCount,
      pendingResultCount,
      isRegistered,
      teamName: firstTeam?.teamName,
    });
  };

  const bySlug = await MatchModel.findOne({ slug: normalizedSlug }).lean<Match>();
  if (bySlug) return attachCount(bySlug);

  // allow direct matchId lookup regardless of casing
  const byId = await MatchModel.findOne({
    matchId: { $in: [slug, normalizedId, slug.toUpperCase()] },
  }).lean<Match>();
  return attachCount(byId);
};

type StartMatchOptions = {
  roomId?: string;
  roomPassword?: string;
  message?: string;
  origin?: string | null;
};

export const startMatch = async (
  matchId: string,
  actor: AuthContext,
  options?: StartMatchOptions
): Promise<Match | null> => {
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

  const roomId = options?.roomId?.trim();
  const roomPassword = options?.roomPassword?.trim();
  const matchUrl =
    options?.origin && (match.slug || match.matchId)
      ? `${options.origin}/matches/${(match.slug ?? match.matchId).toLowerCase()}`
      : undefined;

  if (roomId && roomPassword) {
    const registrations = await RegistrationModel.find({
      matchId: match.matchId,
      status: { $in: ACTIVE_REG_STATUSES },
    }).lean();
    const userIds = registrations.map((reg) => reg.userId).filter(Boolean) as string[];
    const users = userIds.length ? await UserModel.find({ _id: { $in: userIds } }).lean() : [];
    const usersById = new Map(users.map((user: any) => [user._id?.toString?.() ?? "", user]));
    const { sendMatchRoomEmail } = await import("@/lib/email/mailer");

    await Promise.allSettled(
      registrations.map((reg) => {
        const user = usersById.get(reg.userId);
        const email = user?.email;
        if (!email) return Promise.resolve();
        return sendMatchRoomEmail(email, {
          name: user?.name,
          matchName: match.title ?? match.matchId,
          roomId,
          roomPassword,
          matchUrl,
          message: options?.message?.trim() || undefined,
        });
      })
    );
  }

  await MatchModel.updateOne({ matchId: match.matchId }, { $set: { status: MatchStatus.ONGOING } });
  return sanitizeMatch({ ...match, status: MatchStatus.ONGOING }) as Match;
};

export const closeMatchWithWinner = async (matchId: string, submissionId: string, actor: AuthContext): Promise<Match | null> => {
  await connectDb();
  const normalizedId = matchId.toUpperCase();
  const match = await MatchModel.findOne({ matchId: { $in: [matchId, normalizedId, matchId.toLowerCase()] } }).lean<Match>();
  if (!match) return null;
  const isOwner = match.createdBy === actor.userId;
  const isAdmin = actor.role === UserRole.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new Error("Forbidden");
  }
  // Make sure the referenced submission exists and belongs to this match
  const submission = await MatchResultSubmissionModel.findById(submissionId).lean();
  if (!submission || submission.matchId !== match.matchId) {
    throw new Error("Submission not found");
  }

  // Gather all verified submissions and order by score rules
  const verifiedSubs = await MatchResultSubmissionModel.find({ matchId: match.matchId, status: ResultStatus.VERIFIED })
    .sort({ totalScore: -1, kills: -1, placement: 1, createdAt: 1 })
    .lean();
  if (!verifiedSubs.length) {
    throw new Error("No verified submissions found");
  }

  const placementPoints: Record<number, number> = { 1: 15, 2: 12, 3: 10, 4: 8, 5: 6, 6: 4, 7: 2, 8: 1 };
  const calcScore = (placement?: number, kills?: number) => {
    const placementScore = placement && placement > 0 ? placementPoints[placement] ?? 0 : 0;
    const killScore = kills && kills > 0 ? kills : 0;
    return placementScore + killScore;
  };

  const userIds = verifiedSubs.map((s) => s.userId);
  const regs = await RegistrationModel.find({
    matchId: match.matchId,
    userId: { $in: userIds },
    status: { $in: ACTIVE_REG_STATUSES },
  }).lean();
  const regByUser = new Map(regs.map((r) => [r.userId, r]));

  const matchResults = verifiedSubs.map((sub, idx) => {
    const reg = regByUser.get(sub.userId);
    const score = sub.totalScore ?? calcScore(sub.placement, sub.kills);
    return {
      position: idx + 1,
      userId: sub.userId,
      submissionId: sub._id?.toString(),
      teamName: sub.teamName || reg?.teamName,
      teamId: reg?._id?.toString(),
      totalScore: score,
    };
  });

  const winner = matchResults[0];

  const matchClosed = await MatchModel.findOneAndUpdate(
    { matchId: match.matchId },
    {
      $set: {
        status: MatchStatus.COMPLETED,
        winner,
        matchResults,
      },
    },
    { new: true }
  ).lean<Match | null>();

  return sanitizeMatch(matchClosed);
};
