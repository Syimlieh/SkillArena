import crypto from "crypto";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { getEnv } from "@/lib/env";
import { connectDb } from "@/lib/db";
import { MatchModel } from "@/models/Match.model";
import { RegistrationModel } from "@/models/Registration.model";
import { PaymentOrderModel } from "@/models/PaymentOrder.model";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { registerForMatch } from "@/modules/registrations/registration.service";
import { RegistrationPayload } from "@/types/payment-order.types";
import { UserModel } from "@/models/User.model";

type CreateOrderInput = {
  userId: string;
  matchId: string;
  registration: RegistrationPayload;
  origin?: string | null;
};

const cashfreeApiBaseUrl = (env: string | undefined) =>
  env === "PROD" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

const cashfreeCheckoutBaseUrl = (env: string | undefined) =>
  env === "PROD" ? "https://payments.cashfree.com/pg/checkout" : "https://sandbox.cashfree.com/pg/checkout";

const buildNotifyUrl = (origin: string | null | undefined) => {
  if (!origin) return undefined;
  return `${origin}/api/webhooks/cashfree`;
};

const buildCashfreeClient = () => {
  const env = getEnv();
  const environment = env.CASHFREE_ENV === "PROD" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
  return new Cashfree(environment, env.CASHFREE_CLIENT_ID, env.CASHFREE_CLIENT_SECRET);
};

const cashfreeMode = (envValue: string | undefined) => (envValue === "PROD" ? "production" : "sandbox");

export const createCashfreeOrder = async (input: CreateOrderInput) => {
  await connectDb();
  const env = getEnv();
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

  const existingOrder = await PaymentOrderModel.findOne({
    userId: input.userId,
    matchId: match.matchId,
    status: PaymentStatus.INITIATED,
  }).lean();
  if (existingOrder?.paymentSessionId) {
    return {
      orderId: existingOrder.orderId,
      paymentSessionId: existingOrder.paymentSessionId,
      checkoutUrl: `${cashfreeCheckoutBaseUrl(env.CASHFREE_ENV)}?payment_session_id=${encodeURIComponent(
        existingOrder.paymentSessionId
      )}`,
      cashfreeMode: cashfreeMode(env.CASHFREE_ENV),
    };
  }

  const user = await UserModel.findById(input.userId).lean();
  if (!user?.emailVerified) {
    throw new Error("Please verify your email before joining a match");
  }
  if (!user?.phone) {
    throw new Error("Phone number is required for payments");
  }

  const orderId = crypto.randomUUID();
  
  const redirectUrl = input.origin ? `${input.origin}/payment/return?order_id=${orderId}` : undefined;
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
      return_url: redirectUrl,
      notify_url: notifyUrl,
    },
  };

  let data: any;
  try {
    const cashfree = buildCashfreeClient();
    const response = await cashfree.PGCreateOrder(payload);
    data = response?.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to create payment order";
    throw new Error(message);
  }

  if (!data?.payment_session_id) {
    throw new Error("Cashfree did not return a payment session id");
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
    checkoutUrl: `${cashfreeCheckoutBaseUrl(env.CASHFREE_ENV)}?payment_session_id=${encodeURIComponent(
      data?.payment_session_id
    )}`,
    cashfreeMode: cashfreeMode(env.CASHFREE_ENV),
  };
};

export const verifyCashfreeSignature = (rawBody: string, timestamp: string | null, signature: string | null) => {
  if (!signature || !timestamp) return false;
  const { CASHFREE_CLIENT_SECRET } = getEnv();
  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", CASHFREE_CLIENT_SECRET).update(payload).digest("base64");
  const sig = Buffer.from(signature, "base64");
  const exp = Buffer.from(expected, "base64");
  if (sig.length !== exp.length) return false;
  return crypto.timingSafeEqual(sig, exp);
};

type CashfreeWebhook = {
  event?: string;
  type?: string;
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

const assertAmountCurrencyMatch = (payloadAmount: unknown, payloadCurrency: unknown, order: { amount: number; currency: string }) => {
  const amount = typeof payloadAmount === "number" ? payloadAmount : Number(payloadAmount);
  if (!Number.isFinite(amount)) {
    throw new Error("Invalid order amount");
  }
  if (Math.abs(amount - order.amount) > 0.01) {
    throw new Error("Amount mismatch");
  }
  const currency = String(payloadCurrency || "").toUpperCase();
  if (currency && currency !== String(order.currency).toUpperCase()) {
    throw new Error("Currency mismatch");
  }
};

const linkPaymentToRegistration = async (orderId: string, registrationId: string, amount: number) => {
  await RegistrationModel.findByIdAndUpdate(registrationId, {
    $set: {
      paymentOrderId: orderId,
      paymentReference: orderId,
      paymentAmount: amount,
      paymentMethod: "CASHFREE",
      status: RegistrationStatus.CONFIRMED,
    },
  });

  await PaymentOrderModel.findOneAndUpdate(
    { orderId },
    { $set: { registrationId } }
  );
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

  assertAmountCurrencyMatch(payload?.data?.order?.order_amount, payload?.data?.order?.order_currency, order);

  const orderStatus = payload?.data?.order?.order_status;
  const paymentStatus = payload?.data?.payment?.payment_status;
  const nextStatus = mapStatus(orderStatus, paymentStatus);
  if (order.status === nextStatus) {
    if (
      order.cashfreeOrderStatus !== orderStatus ||
      order.cashfreePaymentStatus !== paymentStatus ||
      order.cashfreeEventType !== (payload?.type ?? payload?.event)
    ) {
      order.cashfreeOrderStatus = orderStatus;
      order.cashfreePaymentStatus = paymentStatus;
      order.cashfreeEventType = payload?.type ?? payload?.event;
      await order.save();
    }
    return order.toObject();
  }

  order.status = nextStatus;
  order.cashfreeOrderStatus = orderStatus;
  order.cashfreePaymentStatus = paymentStatus;
  order.cashfreeEventType = payload?.type ?? payload?.event;
  await order.save();

  if (nextStatus === PaymentStatus.SUCCESS) {
    try {
      const result = await registerForMatch(order.matchId, order.userId, order.registration);
      const registrationId =
        (result.registration as any)?._id?.toString?.() ?? (result.registration as any)?._id;
      if (registrationId) {
        await linkPaymentToRegistration(order.orderId, registrationId, order.amount);
      }
    } catch (err: any) {
      if (err?.message === "You are already registered for this match") {
        const existing = await RegistrationModel.findOne({
          userId: order.userId,
          matchId: order.matchId,
        }).lean();
        const registrationId = (existing as any)?._id?.toString?.() ?? (existing as any)?._id;
        if (registrationId) {
          await linkPaymentToRegistration(order.orderId, registrationId, order.amount);
        }
      } else {
        throw err;
      }
    }
  }

  return order.toObject();
};

export const fetchCashfreeOrderStatus = async (orderId: string) => {
  const env = getEnv();
  const url = `${cashfreeApiBaseUrl(env.CASHFREE_ENV)}/orders/${orderId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-client-id": env.CASHFREE_CLIENT_ID,
      "x-client-secret": env.CASHFREE_CLIENT_SECRET,
      "x-api-version": "2023-08-01",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Unable to fetch order status");
  }
  return data;
};

export const confirmCashfreeOrder = async (orderId: string) => {
  await connectDb();
  const order = await PaymentOrderModel.findOne({ orderId });
  if (!order) {
    throw new Error("Order not found");
  }

  const cashfreeStatus = await fetchCashfreeOrderStatus(orderId);
  assertAmountCurrencyMatch(cashfreeStatus?.order_amount, cashfreeStatus?.order_currency, order);
  const orderStatus = cashfreeStatus?.order_status;
  const paymentStatus = cashfreeStatus?.payment_status;
  const nextStatus = mapStatus(orderStatus, paymentStatus);

  if (
    order.status !== nextStatus ||
    order.cashfreeOrderStatus !== orderStatus ||
    order.cashfreePaymentStatus !== paymentStatus
  ) {
    order.status = nextStatus;
    order.cashfreeOrderStatus = orderStatus;
    order.cashfreePaymentStatus = paymentStatus;
    await order.save();
  }

  if (nextStatus === PaymentStatus.SUCCESS) {
    try {
      const result = await registerForMatch(order.matchId, order.userId, order.registration);
      const registrationId =
        (result.registration as any)?._id?.toString?.() ?? (result.registration as any)?._id;
      if (registrationId) {
        await linkPaymentToRegistration(order.orderId, registrationId, order.amount);
      }
    } catch (err: any) {
      if (err?.message === "You are already registered for this match") {
        const existing = await RegistrationModel.findOne({
          userId: order.userId,
          matchId: order.matchId,
        }).lean();
        const registrationId = (existing as any)?._id?.toString?.() ?? (existing as any)?._id;
        if (registrationId) {
          await linkPaymentToRegistration(order.orderId, registrationId, order.amount);
        }
      } else {
        throw err;
      }
    }
  }

  return { order: order.toObject(), cashfreeStatus };
};
