import { z } from "zod";
import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MATCH_DEFAULTS } from "@/lib/constants";

export const prizeBreakdownSchema = z.object({
  first: z.number().min(0),
  second: z.number().min(0),
  third: z.number().min(0),
});

export const matchSchema = z
  .object({
    map: z.nativeEnum(MatchMap),
    title: z.string().min(3).max(120).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "startDate must be YYYY-MM-DD"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "startTime must be HH:mm"),
    entryFee: z.number().min(1).max(500).default(MATCH_DEFAULTS.entryFee),
    maxSlots: z.number().min(1).max(MATCH_DEFAULTS.maxSlots).default(MATCH_DEFAULTS.maxSlots),
    prizeBreakdown: prizeBreakdownSchema.default(MATCH_DEFAULTS.prizes),
    prizePool: z.number().min(0).optional(),
    status: z.nativeEnum(MatchStatus).default(MatchStatus.UPCOMING).optional(),
  })
  .refine(
    (data) => {
      const pool =
        data.prizePool ??
        data.prizeBreakdown.first + data.prizeBreakdown.second + data.prizeBreakdown.third;
      return pool === data.prizeBreakdown.first + data.prizeBreakdown.second + data.prizeBreakdown.third;
    },
    {
      message: "prizePool must equal sum of prizeBreakdown",
      path: ["prizePool"],
    }
  );

export type MatchInput = z.infer<typeof matchSchema>;
