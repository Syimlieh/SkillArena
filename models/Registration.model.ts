import mongoose, { Schema, Model } from "mongoose";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { Registration } from "@/types/registration.types";

const RegistrationSchema = new Schema<Registration>(
  {
    userId: { type: String, required: true, index: true },
    matchId: { type: String, required: true, index: true },
    status: { type: String, enum: Object.values(RegistrationStatus), required: true },
    teamName: { type: String },
    captainBgmiId: { type: String, required: true },
    captainIgn: { type: String },
    squadBgmiIds: { type: [String], default: [] },
    lockedAt: { type: Date },
    lockedBy: { type: String },
    paymentReference: { type: String },
    paymentAmount: { type: Number },
    paymentMethod: { type: String },
    paymentNote: { type: String },
    recordedBy: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

RegistrationSchema.index({ userId: 1, matchId: 1 }, { unique: true });

export const RegistrationModel: Model<Registration> =
  mongoose.models.Registration || mongoose.model<Registration>("Registration", RegistrationSchema);
