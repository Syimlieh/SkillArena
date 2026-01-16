import mongoose, { Model, Schema } from "mongoose";
import { MatchRequestStatus } from "@/enums/MatchRequestStatus.enum";
import { MatchRequestType } from "@/enums/MatchRequestType.enum";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchRequest } from "@/types/match-request.types";

const MatchRequestSchema = new Schema<MatchRequest>(
  {
    requestedByUserId: { type: String, required: true, index: true },
    map: { type: String, enum: Object.values(MatchMap), required: true },
    matchType: { type: String, enum: Object.values(MatchRequestType), required: true },
    preferredTimeRange: { type: String, required: true },
    entryFeeRange: { type: String },
    note: { type: String },
    status: { type: String, enum: Object.values(MatchRequestStatus), default: MatchRequestStatus.OPEN },
  },
  { timestamps: true }
);

export const MatchRequestModel: Model<MatchRequest> =
  mongoose.models.MatchRequest || mongoose.model<MatchRequest>("MatchRequest", MatchRequestSchema);
