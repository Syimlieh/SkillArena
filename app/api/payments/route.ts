import { NextResponse } from "next/server";
import { z } from "zod";
import { initPayment } from "@/modules/payments/payment.service";
import { withApiLogger } from "@/lib/api-logger";

const paymentInitSchema = z.object({
  userId: z.string(),
  scrimId: z.string(),
  amount: z.number().positive(),
});

export const POST = withApiLogger("api-payments", "POST", async (req: Request) => {
  const body = await req.json();
  const parsed = paymentInitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payment = await initPayment(parsed.data);
  return NextResponse.json(payment, { status: 201 });
});
