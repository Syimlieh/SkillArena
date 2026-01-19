import { Types } from "mongoose";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";

export type RegistrationPayload = {
  teamName?: string;
  captainBgmiId: string;
  captainIgn?: string;
  squadBgmiIds?: string[];
};

export interface PaymentOrder {
  _id?: Types.ObjectId;
  orderId: string;
  userId: string;
  matchId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentSessionId?: string;
  registrationId?: string;
  gateway: "CASHFREE";
  cashfreeOrderStatus?: string;
  cashfreePaymentStatus?: string;
  cashfreeEventType?: string;
  postPaymentError?: string;
  registration: RegistrationPayload;
  createdAt?: Date;
  updatedAt?: Date;
}
