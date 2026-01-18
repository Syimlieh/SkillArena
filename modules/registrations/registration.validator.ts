import { z } from "zod";
import { BGMI_ID_LENGTH } from "@/lib/constants";

const bgmiIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "BGMI ID must be numeric")
  .min(BGMI_ID_LENGTH.min, `BGMI ID must be at least ${BGMI_ID_LENGTH.min} digits`)
  .max(BGMI_ID_LENGTH.max, `BGMI ID must be at most ${BGMI_ID_LENGTH.max} digits`);

export const registerMatchParamsSchema = z.object({
  matchId: z.string().min(3),
});

export type RegisterMatchParams = z.infer<typeof registerMatchParamsSchema>;

export const registerMatchPayloadSchema = z
  .object({
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

export type RegisterMatchPayload = z.infer<typeof registerMatchPayloadSchema>;

export const adminRegisterPayloadSchema = z
  .object({
    userId: z.string().min(1, "User is required"),
    teamName: z.string().trim().max(100).optional(),
    captainBgmiId: bgmiIdSchema,
    captainIgn: z.string().trim().max(30).optional(),
    squadBgmiIds: z.array(bgmiIdSchema).max(3).optional(),
    paymentReference: z.string().trim().optional(),
    paymentAmount: z.number().min(0).optional(),
    paymentMethod: z.string().trim().optional(),
    paymentNote: z.string().trim().max(500).optional(),
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

export type AdminRegisterPayload = z.infer<typeof adminRegisterPayloadSchema>;
