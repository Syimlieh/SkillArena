import { connectDb } from "@/lib/db";
import { MatchRequestModel } from "@/models/MatchRequest.model";
import { MatchRequestVoteModel } from "@/models/MatchRequestVote.model";
import { MatchRequestStatus } from "@/enums/MatchRequestStatus.enum";
import { MatchRequestAdmin, MatchRequestPublic } from "@/types/match-request.types";
import { UserModel } from "@/models/User.model";

export class MatchRequestError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const serializeId = (id: any): string => (typeof id === "string" ? id : id?.toString?.() ?? "");

export const createMatchRequest = async (userId: string, payload: {
  map: string;
  matchType: string;
  preferredTimeRange: string;
  entryFeeRange?: string;
  note?: string;
}) => {
  await connectDb();
  const doc = await MatchRequestModel.create({
    requestedByUserId: userId,
    map: payload.map,
    matchType: payload.matchType,
    preferredTimeRange: payload.preferredTimeRange,
    entryFeeRange: payload.entryFeeRange,
    note: payload.note,
    status: MatchRequestStatus.OPEN,
  });
  return doc.toObject();
};

const loadVoteCounts = async (requestIds: string[]) => {
  const counts = await MatchRequestVoteModel.aggregate<{ _id: string; count: number }>([
    { $match: { requestId: { $in: requestIds } } },
    { $group: { _id: "$requestId", count: { $sum: 1 } } },
  ]);
  return new Map<string, number>(counts.map((item) => [item._id, item.count]));
};

const loadUserVotes = async (userId: string, requestIds: string[]) => {
  const votes = await MatchRequestVoteModel.find({ requestId: { $in: requestIds }, userId }).lean();
  return new Set(votes.map((vote) => vote.requestId));
};

export const listMatchRequests = async (options?: {
  userId?: string | null;
  includeVoters?: boolean;
}): Promise<MatchRequestPublic[] | MatchRequestAdmin[]> => {
  await connectDb();
  const requests = await MatchRequestModel.find().sort({ createdAt: -1 }).lean();
  const requestIds = requests.map((request) => serializeId(request._id));
  const voteCountMap = await loadVoteCounts(requestIds);
  const votedSet = options?.userId ? await loadUserVotes(options.userId, requestIds) : new Set<string>();

  if (options?.includeVoters) {
    const votes = await MatchRequestVoteModel.find({ requestId: { $in: requestIds } }).lean();
    const voterIds = Array.from(new Set(votes.map((vote) => vote.userId)));
    const users = voterIds.length ? await UserModel.find({ _id: { $in: voterIds } }).lean() : [];
    const userMap = new Map(users.map((user: any) => [serializeId(user._id), user]));
    const votersByRequest = new Map<string, { userId: string; name?: string; email?: string }[]>();

    votes.forEach((vote) => {
      const user = userMap.get(vote.userId);
      const entry = { userId: vote.userId, name: user?.name, email: user?.email };
      const list = votersByRequest.get(vote.requestId) ?? [];
      list.push(entry);
      votersByRequest.set(vote.requestId, list);
    });

    const requesterIds = Array.from(new Set(requests.map((request) => request.requestedByUserId)));
    const requesters = requesterIds.length ? await UserModel.find({ _id: { $in: requesterIds } }).lean() : [];
    const requesterMap = new Map(requesters.map((user: any) => [serializeId(user._id), user]));

    return requests.map((request) => {
      const requestId = serializeId(request._id);
      const requester = requesterMap.get(request.requestedByUserId);
      return {
        id: requestId,
        map: request.map,
        matchType: request.matchType,
        preferredTimeRange: request.preferredTimeRange,
        entryFeeRange: request.entryFeeRange,
        note: request.note,
        status: request.status,
        createdAt: request.createdAt?.toString?.() ?? new Date().toISOString(),
        voteCount: voteCountMap.get(requestId) ?? 0,
        hasVoted: options?.userId ? votedSet.has(requestId) : undefined,
        requestedByUserId: request.requestedByUserId,
        requestedByName: requester?.name,
        requestedByEmail: requester?.email,
        voters: votersByRequest.get(requestId) ?? [],
      } satisfies MatchRequestAdmin;
    });
  }

  return requests.map((request) => {
    const requestId = serializeId(request._id);
    return {
      id: requestId,
      map: request.map,
      matchType: request.matchType,
      preferredTimeRange: request.preferredTimeRange,
      entryFeeRange: request.entryFeeRange,
      note: request.note,
      status: request.status,
      createdAt: request.createdAt?.toString?.() ?? new Date().toISOString(),
      voteCount: voteCountMap.get(requestId) ?? 0,
      hasVoted: options?.userId ? votedSet.has(requestId) : undefined,
    } satisfies MatchRequestPublic;
  });
};

export const voteForMatchRequest = async (userId: string, requestId: string) => {
  await connectDb();
  const request = await MatchRequestModel.findById(requestId).lean();
  if (!request) throw new MatchRequestError("Match request not found", 404);
  if (request.status !== MatchRequestStatus.OPEN) {
    throw new MatchRequestError("Match request is not open for voting", 409);
  }
  if (request.requestedByUserId === userId) {
    throw new MatchRequestError("You cannot vote on your own request", 403);
  }

  try {
    await MatchRequestVoteModel.create({ requestId, userId });
  } catch (error: any) {
    if (error?.code === 11000) {
      throw new MatchRequestError("You already voted for this request", 409);
    }
    throw error;
  }

  const count = await MatchRequestVoteModel.countDocuments({ requestId });
  return { voteCount: count, hasVoted: true };
};

export const removeVoteForMatchRequest = async (userId: string, requestId: string) => {
  await connectDb();
  await MatchRequestVoteModel.deleteOne({ requestId, userId });
  const count = await MatchRequestVoteModel.countDocuments({ requestId });
  return { voteCount: count, hasVoted: false };
};
