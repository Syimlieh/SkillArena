import mongoose, { Schema, Model } from "mongoose";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";
import { Payment } from "@/types/payment.types";

const PaymentSchema = new Schema<Payment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scrimId: { type: Schema.Types.ObjectId, ref: "Scrim", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.INITIATED },
    gatewayRef: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const PaymentModel: Model<Payment> =
  mongoose.models.Payment || mongoose.model<Payment>("Payment", PaymentSchema);
