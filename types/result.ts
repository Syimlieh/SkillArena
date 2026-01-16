import { Types } from "mongoose";
import { ResultStatus } from "@/enums/ResultStatus.enum";

export interface MatchResultSubmission {
  _id?: Types.ObjectId;
  matchId: string;
  userId: string;
  fileId?: string;
  screenshotUrl: string;
  hostApproved?: boolean;
  hostRejected?: boolean;
  hostRejectReason?: string;
  hostApprovedAt?: Date | string;
  hostApprovedBy?: string;
  adminRejectReason?: string;
  status: ResultStatus;
  placement?: number;
  kills?: number;
  totalScore?: number;
  reviewerId?: string;
  teamName?: string;
  createdAt?: Date | string;
}

export interface ResultSubmissionResponse {
  status: ResultStatus;
  fileId?: string;
  screenshotUrl: string;
  hostApproved?: boolean;
  hostRejected?: boolean;
  hostRejectReason?: string;
  hostApprovedAt?: Date | string;
  hostApprovedBy?: string;
  adminRejectReason?: string;
  submittedAt: string;
  submissionId?: string;
  placement?: number;
  kills?: number;
  totalScore?: number;
  teamName?: string;
}
