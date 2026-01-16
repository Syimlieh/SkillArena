import mongoose, { Model, Schema } from "mongoose";
import { MatchRequestVote } from "@/types/match-request.types";

const MatchRequestVoteSchema = new Schema<MatchRequestVote>(
  {
    requestId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

MatchRequestVoteSchema.index({ requestId: 1, userId: 1 }, { unique: true });

export const MatchRequestVoteModel: Model<MatchRequestVote> =
  mongoose.models.MatchRequestVote ||
  mongoose.model<MatchRequestVote>("MatchRequestVote", MatchRequestVoteSchema);
