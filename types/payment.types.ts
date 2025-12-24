import { PaymentStatus } from "@/enums/PaymentStatus.enum";
import { Types } from "mongoose";

export interface Payment {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  scrimId: Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  gatewayRef: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentInitPayload {
  userId: string;
  scrimId: string;
  amount: number;
}

export interface PaymentWebhookPayload {
  reference: string;
  status: PaymentStatus;
  signature: string;
}
