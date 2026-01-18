import mongoose, { Schema, Model } from "mongoose";
import { PaymentOrder } from "@/types/payment-order.types";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";

const RegistrationSchema = new Schema(
  {
    teamName: { type: String },
    captainBgmiId: { type: String, required: true },
    captainIgn: { type: String },
    squadBgmiIds: { type: [String], default: [] },
  },
  { _id: false }
);

const PaymentOrderSchema = new Schema<PaymentOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    matchId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.INITIATED },
    paymentSessionId: { type: String },
    registrationId: { type: String },
    gateway: { type: String, default: "CASHFREE" },
    cashfreeOrderStatus: { type: String },
    cashfreePaymentStatus: { type: String },
    cashfreeEventType: { type: String },
    registration: { type: RegistrationSchema, required: true },
  },
  { timestamps: true }
);

PaymentOrderSchema.index({ userId: 1, matchId: 1, status: 1 });

export const PaymentOrderModel: Model<PaymentOrder> =
  mongoose.models.PaymentOrder || mongoose.model<PaymentOrder>("PaymentOrder", PaymentOrderSchema);
