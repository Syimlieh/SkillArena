import { NextResponse } from "next/server";
import { handleCashfreeWebhook, verifyCashfreeSignature } from "@/modules/payments/cashfree.service";
import { createModuleLogger } from "@/lib/logger";

const { logInfo, logWarn, logError } = createModuleLogger("cashfree-webhook");

export const POST = async (req: Request) => {
  logInfo("webhook: received");
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  const timestamp = req.headers.get("x-webhook-timestamp");
  const verified = verifyCashfreeSignature(rawBody, timestamp, signature);
  if (!verified) {
    logWarn("webhook: invalid signature", { hasSignature: !!signature, hasTimestamp: !!timestamp });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  logInfo("webhook: signature verified", { verified });

  try {
    const payload = JSON.parse(rawBody);
    logInfo("webhook: payload parsed", {
      orderId: payload?.data?.order?.order_id,
      event: payload?.type ?? payload?.event,
    });
    const updated = await handleCashfreeWebhook(payload);
    logInfo("webhook: processed", { orderId: payload?.data?.order?.order_id });
    return NextResponse.json(updated);
  } catch (error) {
    logError("webhook: failed", { message: (error as Error).message });
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
};
