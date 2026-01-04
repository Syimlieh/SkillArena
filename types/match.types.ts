import { Types } from "mongoose";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchType } from "@/enums/MatchType.enum";

export interface PrizeBreakdown {
  first: number;
  second: number;
  third: number;
}

export interface Match {
  _id?: Types.ObjectId;
  matchId: string;
  slug: string;
  map: MatchMap;
  title: string;
  startTime: Date | string;
  entryFee: number;
  maxSlots: number;
  prizePool: number;
  prizeBreakdown: PrizeBreakdown;
  status: MatchStatus;
  type?: MatchType;
  createdBy: string;
  registrationCount?: number;
  pendingResultCount?: number;
  winner?: {
    teamName?: string;
    userId?: string;
    submissionId?: string;
    totalScore?: number;
  };
  matchResults?: {
    position: number;
    teamName?: string;
    teamId?: string;
    userId?: string;
    submissionId?: string;
    totalScore?: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMatchInput {
  map: MatchMap;
  title?: string;
  startDate: string;
  startTime: string;
  entryFee?: number;
  maxSlots?: number;
  prizeBreakdown?: PrizeBreakdown;
}
