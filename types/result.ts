import { Types } from "mongoose";
import { ResultStatus } from "@/enums/ResultStatus.enum";

export interface MatchResultSubmission {
  _id?: Types.ObjectId;
  matchId: string;
  userId: string;
  fileId?: string;
  screenshotUrl: string;
  status: ResultStatus;
  placement?: number;
  kills?: number;
  totalScore?: number;
  reviewerId?: string;
  createdAt?: Date | string;
}

export interface ResultSubmissionResponse {
  status: ResultStatus;
  fileId?: string;
  screenshotUrl: string;
  submittedAt: string;
  submissionId?: string;
  placement?: number;
  kills?: number;
  totalScore?: number;
}
