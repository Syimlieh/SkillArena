import { NextResponse } from "next/server";
import { z } from "zod";
import { initPayment } from "@/modules/payments/payment.service";

const paymentInitSchema = z.object({
  userId: z.string(),
  scrimId: z.string(),
  amount: z.number().positive(),
});

export const POST = async (req: Request) => {
  const body = await req.json();
  const parsed = paymentInitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payment = await initPayment(parsed.data);
  return NextResponse.json(payment, { status: 201 });
};
