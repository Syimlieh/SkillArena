import mongoose, { Schema, Model } from "mongoose";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { ScrimMap } from "@/enums/ScrimMap.enum";
import { Scrim } from "@/types/scrim.types";

const ScrimSchema = new Schema<Scrim>(
  {
    slug: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    entryFee: { type: Number, required: true, min: 0 },
    maxSlots: { type: Number, required: true, min: 1 },
    availableSlots: { type: Number, min: 0 },
    prizePool: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(ScrimStatus),
      default: ScrimStatus.UPCOMING,
      required: true,
    },
    map: { type: String, enum: Object.values(ScrimMap), default: ScrimMap.ERANGEL },
    startTime: { type: Date, required: true },
    roomId: { type: String },
    roomPassword: { type: String },
  },
  { timestamps: true }
);

export const ScrimModel: Model<Scrim> =
  mongoose.models.Scrim || mongoose.model<Scrim>("Scrim", ScrimSchema);
