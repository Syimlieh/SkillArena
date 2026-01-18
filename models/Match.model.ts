import mongoose, { Schema, Model } from "mongoose";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchType } from "@/enums/MatchType.enum";
import { MatchOccurrence } from "@/enums/MatchOccurrence.enum";
import { Match } from "@/types/match.types";

const PrizeSchema = new Schema(
  {
    first: { type: Number, required: true, min: 0 },
    second: { type: Number, required: true, min: 0 },
    third: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const MatchSchema = new Schema<Match>(
  {
    matchId: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    map: { type: String, enum: Object.values(MatchMap), required: true },
    title: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    entryFee: { type: Number, required: true, min: 0 },
    maxSlots: { type: Number, required: true, min: 1 },
    prizePool: { type: Number, required: true, min: 0 },
    prizeBreakdown: { type: PrizeSchema, required: true },
    status: { type: String, enum: Object.values(MatchStatus), default: MatchStatus.UPCOMING, required: true },
    type: { type: String, enum: Object.values(MatchType), default: MatchType.OFFICIAL, required: true },
    occurrence: { type: String, enum: Object.values(MatchOccurrence), default: MatchOccurrence.ONE_TIME, required: true },
    createdBy: { type: String, required: true },
    winner: {
      teamName: { type: String },
      userId: { type: String },
      submissionId: { type: String },
      totalScore: { type: Number },
    },
    matchResults: [
      {
        position: { type: Number, required: true },
        teamName: { type: String },
        teamId: { type: String },
        userId: { type: String },
        submissionId: { type: String },
        totalScore: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

MatchSchema.index({ map: 1, startTime: 1 });
MatchSchema.index({ matchId: 1 }, { unique: true });
MatchSchema.index({ slug: 1 }, { unique: true });

export const MatchModel: Model<Match> =
  mongoose.models.Match || mongoose.model<Match>("Match", MatchSchema);
