import crypto from "crypto";
import { getEnv } from "@/lib/env";
import { connectDb } from "@/lib/db";
import { MatchModel } from "@/models/Match.model";
import { RegistrationModel } from "@/models/Registration.model";
import { PaymentOrderModel } from "@/models/PaymentOrder.model";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { registerForMatch } from "@/modules/registrations/registration.service";
import { RegistrationPayload } from "@/types/payment-order.types";
import { UserModel } from "@/models/User.model";

type CreateOrderInput = {
  userId: string;
  matchId: string;
  registration: RegistrationPayload;
  origin?: string | null;
};

const cashfreeBaseUrl = (env: string | undefined) =>
  env === "PROD" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

const buildReturnUrl = (origin: string | null | undefined, matchId: string) => {
  if (!origin) return undefined;
  return `${origin}/matches/${matchId.toLowerCase()}`;
};

const buildNotifyUrl = (origin: string | null | undefined) => {
  if (!origin) return undefined;
  return `${origin}/api/webhooks/cashfree`;
};

export const createCashfreeOrder = async (input: CreateOrderInput) => {
  await connectDb();
  const match = await MatchModel.findOne({ matchId: input.matchId }).lean();
  if (!match) {
    throw new Error("Match not found");
  }
  if (match.status !== MatchStatus.UPCOMING) {
    throw new Error("Match is not open for registration");
  }

  const existingReg = await RegistrationModel.findOne({
    userId: input.userId,
    matchId: match.matchId,
    status: { $ne: "CANCELLED" },
  }).lean();
  if (existingReg) {
    throw new Error("You are already registered for this match");
  }

  const user = await UserModel.findById(input.userId).lean();
  if (!user?.emailVerified) {
    throw new Error("Please verify your email before joining a match");
  }
  if (!user?.phone) {
    throw new Error("Phone number is required for payments");
  }

  const orderId = crypto.randomUUID();
  const env = getEnv();
  const url = `${cashfreeBaseUrl(env.CASHFREE_ENV)}/orders`;
  const returnUrl = buildReturnUrl(input.origin, match.slug ?? match.matchId);
  const notifyUrl = buildNotifyUrl(input.origin);

  const payload = {
    order_id: orderId,
    order_amount: match.entryFee,
    order_currency: "INR",
    customer_details: {
      customer_id: input.userId,
      customer_email: user.email,
      customer_phone: user.phone,
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: notifyUrl,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": env.CASHFREE_CLIENT_ID,
      "x-client-secret": env.CASHFREE_CLIENT_SECRET,
      "x-api-version": "2023-08-01",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Unable to create payment order");
  }

  await PaymentOrderModel.create({
    orderId,
    userId: input.userId,
    matchId: match.matchId,
    amount: match.entryFee,
    currency: "INR",
    status: PaymentStatus.INITIATED,
    paymentSessionId: data?.payment_session_id,
    gateway: "CASHFREE",
    registration: input.registration,
  });

  return {
    orderId,
    paymentSessionId: data?.payment_session_id,
    checkoutUrl: `${cashfreeBaseUrl(env.CASHFREE_ENV)}/checkout?payment_session_id=${data?.payment_session_id}`,
  };
};

export const verifyCashfreeSignature = (rawBody: string, timestamp: string | null, signature: string | null) => {
  if (!signature || !timestamp) return false;
  const { CASHFREE_CLIENT_SECRET } = getEnv();
  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", CASHFREE_CLIENT_SECRET).update(payload).digest("base64");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

type CashfreeWebhook = {
  event: string;
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
      order_status: string;
    };
    payment?: {
      payment_status?: string;
    };
  };
};

const mapStatus = (orderStatus?: string, paymentStatus?: string): PaymentStatus => {
  const status = paymentStatus || orderStatus || "";
  if (status.toUpperCase() === "SUCCESS" || status.toUpperCase() === "PAID") return PaymentStatus.SUCCESS;
  if (status.toUpperCase() === "FAILED") return PaymentStatus.FAILED;
  return PaymentStatus.INITIATED;
};

export const handleCashfreeWebhook = async (payload: CashfreeWebhook) => {
  await connectDb();
  const orderId = payload?.data?.order?.order_id;
  if (!orderId) {
    throw new Error("Missing order id");
  }
  const order = await PaymentOrderModel.findOne({ orderId });
  if (!order) {
    throw new Error("Order not found");
  }

  const nextStatus = mapStatus(payload?.data?.order?.order_status, payload?.data?.payment?.payment_status);
  if (order.status === nextStatus) {
    return order.toObject();
  }

  order.status = nextStatus;
  await order.save();

  if (nextStatus === PaymentStatus.SUCCESS) {
    try {
      await registerForMatch(order.matchId, order.userId, order.registration);
    } catch (err: any) {
      if (err?.message !== "You are already registered for this match") {
        throw err;
      }
    }
  }

  return order.toObject();
};
