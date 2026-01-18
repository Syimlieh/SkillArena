import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { handleCashfreeWebhook, verifyCashfreeSignature } from "@/modules/payments/cashfree.service";

export const POST = async (req: NextRequest) => {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  const timestamp = req.headers.get("x-webhook-timestamp");
  const verified = verifyCashfreeSignature(rawBody, timestamp, signature);
  if (!verified) {
    return errorResponse("Invalid signature", 401);
  }

  try {
    const payload = JSON.parse(rawBody);
    const updated = await handleCashfreeWebhook(payload);
    return successResponse({ order: updated });
  } catch (err: any) {
    return errorResponse(err?.message || "Webhook error", 400);
  }
};
