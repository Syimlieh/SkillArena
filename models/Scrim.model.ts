import mongoose, { Schema, Model } from "mongoose";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { Scrim } from "@/types/scrim.types";

const ScrimSchema = new Schema<Scrim>(
  {
    title: { type: String, required: true, trim: true },
    entryFee: { type: Number, required: true, min: 0 },
    maxSlots: { type: Number, required: true, min: 1 },
    prizePool: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(ScrimStatus),
      default: ScrimStatus.UPCOMING,
      required: true,
    },
    startTime: { type: Date, required: true },
    roomId: { type: String },
    roomPassword: { type: String },
  },
  { timestamps: true }
);

export const ScrimModel: Model<Scrim> =
  mongoose.models.Scrim || mongoose.model<Scrim>("Scrim", ScrimSchema);
