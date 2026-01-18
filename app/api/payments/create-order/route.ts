import { NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth.server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { createCashfreeOrder } from "@/modules/payments/cashfree.service";
import { BGMI_ID_LENGTH } from "@/lib/constants";

const bgmiIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "BGMI ID must be numeric")
  .min(BGMI_ID_LENGTH.min)
  .max(BGMI_ID_LENGTH.max);

const createOrderSchema = z
  .object({
    matchId: z.string().min(3),
    teamName: z.string().trim().max(100).optional(),
    captainBgmiId: bgmiIdSchema,
    captainIgn: z.string().trim().max(30).optional(),
    squadBgmiIds: z.array(bgmiIdSchema).max(3).optional(),
  })
  .superRefine((data, ctx) => {
    const ids = [data.captainBgmiId, ...(data.squadBgmiIds ?? [])].filter(Boolean);
    const unique = new Set(ids);
    if (unique.size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "BGMI IDs must be unique",
        path: ["squadBgmiIds"],
      });
    }
  });

export const POST = async (req: NextRequest) => {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => ({}));
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid payload", 400, {
        code: "INVALID_INPUT",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
    }

    const order = await createCashfreeOrder({
      userId: user.userId,
      matchId: parsed.data.matchId,
      registration: {
        teamName: parsed.data.teamName,
        captainBgmiId: parsed.data.captainBgmiId,
        captainIgn: parsed.data.captainIgn,
        squadBgmiIds: parsed.data.squadBgmiIds,
      },
      origin: req.headers.get("origin") ?? `${req.headers.get("x-forwarded-proto") || "https"}://${req.headers.get("host") || ""}`,
    });

    return successResponse({
      orderId: order.orderId,
      paymentSessionId: order.paymentSessionId,
      checkoutUrl: order.checkoutUrl,
      cashfreeMode: order.cashfreeMode,
    });
  } catch (err: any) {
    if (err?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    return errorResponse(err?.message || "Unable to create payment order", 400);
  }
};
