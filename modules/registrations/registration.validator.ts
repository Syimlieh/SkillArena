import { z } from "zod";

export const registerMatchParamsSchema = z.object({
  matchId: z.string().min(3),
});

export type RegisterMatchParams = z.infer<typeof registerMatchParamsSchema>;

export const adminRegisterPayloadSchema = z.object({
  userId: z.string().min(1, "User is required"),
  teamName: z.string().trim().max(100).optional(),
  paymentReference: z.string().trim().optional(),
  paymentAmount: z.number().min(0),
  paymentMethod: z.string().trim(),
  paymentNote: z.string().trim().max(500),
});

export type AdminRegisterPayload = z.infer<typeof adminRegisterPayloadSchema>;
