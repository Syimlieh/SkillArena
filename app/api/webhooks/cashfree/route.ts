import { NextResponse } from "next/server";
import { handleCashfreeWebhook, verifyCashfreeSignature } from "@/modules/payments/cashfree.service";

export const POST = async (req: Request) => {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  const timestamp = req.headers.get("x-webhook-timestamp");
  const verified = verifyCashfreeSignature(rawBody, timestamp, signature);
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody);
    const updated = await handleCashfreeWebhook(payload);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
};
