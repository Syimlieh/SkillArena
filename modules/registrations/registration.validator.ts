import { z } from "zod";

export const registerMatchParamsSchema = z.object({
  matchId: z.string().min(3),
});

export type RegisterMatchParams = z.infer<typeof registerMatchParamsSchema>;
