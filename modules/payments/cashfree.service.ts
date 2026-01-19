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
import { createModuleLogger } from "@/lib/logger";

type CreateOrderInput = {
  userId: string;
  matchId: string;
  registration: RegistrationPayload;
  origin?: string | null;
};

const { logInfo, logWarn, logError } = createModuleLogger("cashfree");

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
  logInfo("create order: start", { userId: input.userId });
  await connectDb();
  const env = getEnv();
  const match = await MatchModel.findOne({ matchId: input.matchId }).lean();
  if (!match) {
    logWarn("create order: match not found", { matchId: input.matchId });
    throw new Error("Match not found");
  }
  if (match.status !== MatchStatus.UPCOMING) {
    logWarn("create order: match not open", { status: match.status });
    throw new Error("Match is not open for registration");
  }

  const existingReg = await RegistrationModel.findOne({
    userId: input.userId,
    matchId: match.matchId,
    status: { $ne: "CANCELLED" },
  }).lean();
  if (existingReg && existingReg.status !== RegistrationStatus.PENDING_PAYMENT) {
    logWarn("create order: already registered");
    throw new Error("You are already registered for this match");
  }

  const existingOrder = await PaymentOrderModel.findOne({
    userId: input.userId,
    matchId: match.matchId,
    status: PaymentStatus.INITIATED,
  }).lean();
  if (existingOrder?.paymentSessionId) {
    logInfo("create order: reuse existing payment session", {
      orderId: existingOrder.orderId,
      paymentSessionId: existingOrder.paymentSessionId,
    });
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
    logWarn("create order: email not verified", { userId: input.userId });
    throw new Error("Please verify your email before joining a match");
  }
  if (!user?.phone) {
    logWarn("create order: missing phone");
    throw new Error("Phone number is required for payments");
  }

  const orderId = crypto.randomUUID();

  const redirectUrl = input.origin ? `${input.origin}/payment/return?order_id=${orderId}` : undefined;
  const notifyUrl = buildNotifyUrl(input.origin);
  logInfo("create order: payload prepared", {
    orderId,
    amount: match.entryFee,
    currency: "INR",
    hasRedirectUrl: !!redirectUrl,
    hasNotifyUrl: !!notifyUrl,
  });

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
    logInfo("create order: calling cashfree");
    const cashfree = buildCashfreeClient();
    const response = await cashfree.PGCreateOrder(payload);
    data = response?.data;
    logInfo("create order: cashfree response received", { hasSessionId: !!data?.payment_session_id });
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to create payment order";
    logError("create order: cashfree call failed", { orderId, message });
    throw new Error(message);
  }

  if (!data?.payment_session_id) {
    logError("create order: missing payment session id");
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
  logInfo("create order: saved", { paymentSessionId: data?.payment_session_id });

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
  if (!signature || !timestamp) {
    logWarn("webhook signature: missing headers", { hasSignature: !!signature, hasTimestamp: !!timestamp });
  }
  if (!signature || !timestamp) return false;
  const { CASHFREE_CLIENT_SECRET } = getEnv();
  logWarn("timestamp", { timestamp });
  const payload = `${timestamp}${rawBody}`;
  const expected = crypto.createHmac("sha256", CASHFREE_CLIENT_SECRET).update(payload).digest("base64");
  const sig = Buffer.from(signature, "utf8");
  const exp = Buffer.from(expected, "utf8");
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
    { $set: { registrationId }, $unset: { postPaymentError: "" } }
  );
};

const markPostPaymentFailure = async (orderId: string, message: string) => {
  try {
    await PaymentOrderModel.findOneAndUpdate(
      { orderId },
      { $set: { postPaymentError: message } }
    );
    logError("webhook handle: post-payment failure recorded", { orderId, message });
  } catch (error: any) {
    logError("webhook handle: failed to record post-payment failure", {
      orderId,
      message,
      error: error?.message,
    });
  }
};

export const handleCashfreeWebhook = async (payload: CashfreeWebhook) => {
  logInfo("webhook handle: start", { event: payload?.type ?? payload?.event });
  await connectDb();
  logInfo("webhook handle: payload shape", {
    topKeys: Object.keys((payload ?? {}) as Record<string, unknown>),
    dataKeys: Object.keys(((payload as any)?.data ?? {}) as Record<string, unknown>),
  });
  const orderId =
    payload?.data?.order?.order_id ??
    (payload as any)?.data?.order_id ??
    (payload as any)?.order_id;
  if (!orderId) {
    logWarn("webhook handle: order id not found (likely dashboard test)", { orderId });
    return { acknowledged: true };
  }
  if ((payload as any)?.data?.order_id || (payload as any)?.order_id) {
    logInfo("webhook handle: order id resolved via fallback", { orderId });
  }
  const order = await PaymentOrderModel.findOne({ orderId });
  if (!order) {
    logWarn("webhook handle: order not found (likely dashboard test)", { orderId });
    return { acknowledged: true };
  }

  assertAmountCurrencyMatch(payload?.data?.order?.order_amount, payload?.data?.order?.order_currency, order);
  logInfo("webhook handle: amount/currency verified", { orderId });

  const orderStatus = payload?.data?.order?.order_status;
  const paymentStatus = payload?.data?.payment?.payment_status;
  const nextStatus = mapStatus(orderStatus, paymentStatus);
  logInfo("webhook handle: status mapped", { orderId, orderStatus, paymentStatus, nextStatus });
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
      logInfo("webhook handle: metadata updated", { orderId, status: order.status });
    }
    return order.toObject();
  }

  order.status = nextStatus;
  order.cashfreeOrderStatus = orderStatus;
  order.cashfreePaymentStatus = paymentStatus;
  order.cashfreeEventType = payload?.type ?? payload?.event;
  await order.save();
  logInfo("webhook handle: status updated", { orderId, status: order.status });

  if (nextStatus === PaymentStatus.SUCCESS) {
    try {
      logInfo("webhook handle: registration start", { orderId });
      const result = await registerForMatch(order.matchId, order.userId, order.registration);
      const registrationId =
        (result.registration as any)?._id?.toString?.() ?? (result.registration as any)?._id;
      if (registrationId) {
        await linkPaymentToRegistration(order.orderId, registrationId, order.amount);
        logInfo("webhook handle: registration linked", { orderId, registrationId });
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
          logInfo("webhook handle: existing registration linked", { orderId, registrationId });
        }
      } else {
        logError("registration failed", { orderId, err: err?.message });
        await markPostPaymentFailure(orderId, err?.message || "Registration failed after payment");
        return order.toObject();
      }
    }
  }

  logInfo("webhook handle: completed", { orderId, status: order.status });
  return order.toObject();
};

export const fetchCashfreeOrderStatus = async (orderId: string) => {
  const env = getEnv();
  const url = `${cashfreeApiBaseUrl(env.CASHFREE_ENV)}/orders/${orderId}`;
  logInfo("fetch order status: start", { orderId });
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
    logError("fetch order status: failed", { orderId, message: data?.message });
    throw new Error(data?.message || "Unable to fetch order status");
  }
  logInfo("fetch order status: success", { orderId, orderStatus: data?.order_status });
  return data;
};

export const confirmCashfreeOrder = async (orderId: string) => {
  logInfo("confirm order: start", { orderId });
  await connectDb();
  const order = await PaymentOrderModel.findOne({ orderId });
  if (!order) {
    logWarn("confirm order: order not found", { orderId });
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
    logInfo("confirm order: status updated", { orderId, status: order.status });
  }

  if (nextStatus === PaymentStatus.SUCCESS) {
    try {
      logInfo("confirm order: registration start", { orderId });
      const result = await registerForMatch(order.matchId, order.userId, order.registration);
      const registrationId =
        (result.registration as any)?._id?.toString?.() ?? (result.registration as any)?._id;
      if (registrationId) {
        await linkPaymentToRegistration(order.orderId, registrationId, order.amount);
        logInfo("confirm order: registration linked", { orderId, registrationId });
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
          logInfo("confirm order: existing registration linked", { orderId, registrationId });
        }
      } else {
        logError("confirm order: registration failed", { orderId, message: err?.message });
        throw err;
      }
    }
  }

  logInfo("confirm order: completed", { orderId, status: order.status });
  return { order: order.toObject(), cashfreeStatus };
};
