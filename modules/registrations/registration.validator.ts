import { z } from "zod";

export const registerMatchParamsSchema = z.object({
  matchId: z.string().min(3),
});

export type RegisterMatchParams = z.infer<typeof registerMatchParamsSchema>;

export const adminRegisterPayloadSchema = z.object({
  userId: z.string().min(1, "User is required"),
  paymentReference: z.string().trim().optional(),
  paymentAmount: z.number().min(0).optional(),
  paymentMethod: z.string().trim().optional(),
  paymentNote: z.string().trim().max(500).optional(),
});

export type AdminRegisterPayload = z.infer<typeof adminRegisterPayloadSchema>;
