import { NextResponse } from "next/server";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";
import { verifySignature } from "@/lib/security";
import { handleWebhook } from "@/modules/payments/payment.service";

export const POST = async (req: Request) => {
  const rawBody = await req.text();
  const verified = verifySignature(req, rawBody);
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as { reference: string; status: PaymentStatus; signature: string };
  if (!Object.values(PaymentStatus).includes(payload.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updated = await handleWebhook({
      reference: payload.reference,
      status: payload.status,
      signature: payload.signature,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
};
