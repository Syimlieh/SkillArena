import mongoose, { Model, Schema } from "mongoose";
import { ResultStatus } from "@/enums/ResultStatus.enum";
import { MatchResultSubmission } from "@/types/result";

const MatchResultSubmissionSchema = new Schema<MatchResultSubmission>(
  {
    userId: { type: String, required: true, index: true },
    matchId: { type: String, required: true, index: true },
    fileId: { type: String },
    screenshotUrl: { type: String, required: true },
    hostApproved: { type: Boolean, default: false },
    hostRejected: { type: Boolean, default: false },
    hostRejectReason: { type: String },
    hostApprovedAt: { type: Date },
    hostApprovedBy: { type: String },
    adminRejectReason: { type: String },
    status: { type: String, enum: Object.values(ResultStatus), default: ResultStatus.SUBMITTED, required: true },
    placement: { type: Number },
    kills: { type: Number },
    totalScore: { type: Number },
    reviewerId: { type: String },
    teamName: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

MatchResultSubmissionSchema.index({ userId: 1, matchId: 1 }, { unique: true });

export const MatchResultSubmissionModel: Model<MatchResultSubmission> =
  mongoose.models.MatchResultSubmission || mongoose.model<MatchResultSubmission>("MatchResultSubmission", MatchResultSubmissionSchema);
