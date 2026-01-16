import { z } from "zod";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchRequestType } from "@/enums/MatchRequestType.enum";

export const createMatchRequestSchema = z.object({
  map: z.nativeEnum(MatchMap),
  matchType: z.nativeEnum(MatchRequestType),
  preferredTimeRange: z.string().min(3).max(50),
  entryFeeRange: z.string().max(30).optional(),
  note: z.string().max(200).optional(),
});

export const matchRequestIdSchema = z.object({
  requestId: z.string().min(1),
});
