import { Types } from "mongoose";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchRequestStatus } from "@/enums/MatchRequestStatus.enum";
import { MatchRequestType } from "@/enums/MatchRequestType.enum";

export interface MatchRequest {
  _id?: Types.ObjectId;
  requestedByUserId: string;
  map: MatchMap;
  matchType: MatchRequestType;
  preferredTimeRange: string;
  entryFeeRange?: string;
  note?: string;
  status: MatchRequestStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface MatchRequestVote {
  _id?: Types.ObjectId;
  requestId: string;
  userId: string;
  createdAt?: Date | string;
}

export type MatchRequestPublic = {
  id: string;
  map: MatchMap;
  matchType: MatchRequestType;
  preferredTimeRange: string;
  entryFeeRange?: string;
  note?: string;
  status: MatchRequestStatus;
  createdAt: string;
  voteCount: number;
  hasVoted?: boolean;
};

export type MatchRequestAdmin = MatchRequestPublic & {
  requestedByUserId: string;
  requestedByName?: string;
  requestedByEmail?: string;
  voters: { userId: string; name?: string; email?: string }[];
};
