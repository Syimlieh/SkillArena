import { z } from "zod";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";

export const scrimSchema = z.object({
  title: z.string().min(3),
  entryFee: z.number().int().nonnegative(),
  maxSlots: z.number().int().positive(),
  prizePool: z.number().nonnegative(),
  status: z.nativeEnum(ScrimStatus),
  startTime: z.coerce.date(),
  roomId: z.string().optional(),
  roomPassword: z.string().optional(),
});

export const scrimJoinSchema = z.object({
  scrimId: z.string(),
  userId: z.string(),
  paymentId: z.string().optional(),
});
