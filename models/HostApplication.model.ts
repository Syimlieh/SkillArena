import mongoose, { Schema, Model } from "mongoose";
import { HostApplicationStatus } from "@/enums/HostApplicationStatus.enum";
import { HostApplication } from "@/types/host.types";

const HostApplicationSchema = new Schema<HostApplication>(
  {
    userId: { type: String, required: true, index: true },
    displayName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    hasHostedBefore: { type: Boolean, required: true },
    understandsRules: { type: Boolean, required: true },
    agreesFairPlay: { type: Boolean, required: true },
    understandsBan: { type: Boolean, required: true },
    agreesCoordinate: { type: Boolean, required: true },
    confirmsPayouts: { type: Boolean, required: true },
    confirmsMobile: { type: Boolean, required: true },
    status: { type: String, enum: Object.values(HostApplicationStatus), default: HostApplicationStatus.PENDING },
    adminComment: { type: String },
    reviewedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

HostApplicationSchema.index({ userId: 1, status: 1 });

export const HostApplicationModel: Model<HostApplication> =
  mongoose.models.HostApplication || mongoose.model<HostApplication>("HostApplication", HostApplicationSchema);
