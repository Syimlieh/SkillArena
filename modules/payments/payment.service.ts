import { connectDb } from "@/lib/db";
import { PaymentModel } from "@/models/Payment.model";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";
import { PaymentInitPayload, PaymentWebhookPayload } from "@/types/payment.types";
import { markScrimFullIfNeeded } from "@/modules/scrims/scrim.service";

export const initPayment = async (payload: PaymentInitPayload) => {
  await connectDb();
  const existing = await PaymentModel.findOne({ userId: payload.userId, scrimId: payload.scrimId });
  if (existing) return existing.toObject();
  const gatewayRef = `PHON-${Date.now()}-${payload.userId}`;
  const created = await PaymentModel.create({ ...payload, status: PaymentStatus.INITIATED, gatewayRef });
  return created.toObject();
};

export const handleWebhook = async (data: PaymentWebhookPayload) => {
  await connectDb();
  const payment = await PaymentModel.findOne({ gatewayRef: data.reference });
  if (!payment) throw new Error("Payment not found");

  if (payment.status === data.status) return payment.toObject();

  payment.status = data.status;
  await payment.save();

  if (data.status === PaymentStatus.SUCCESS) {
    await markScrimFullIfNeeded(payment.scrimId.toString());
  }

  return payment.toObject();
};
