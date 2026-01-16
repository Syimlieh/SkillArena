import { z } from "zod";

export const hostApplicationSchema = z.object({
  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters.")
    .max(50, "Display name must be 50 characters or fewer."),
  description: z
    .string()
    .min(10, "Tell us a bit more (10+ characters).")
    .max(500, "Description cannot exceed 500 characters."),
  contactEmail: z.string().email("Enter a valid contact email."),
  hasHostedBefore: z.literal(true, {
    errorMap: () => ({ message: "Please confirm hosting experience." }),
  }),
  understandsRules: z.literal(true, {
    errorMap: () => ({ message: "Please confirm rules understanding." }),
  }),
  agreesFairPlay: z.literal(true, {
    errorMap: () => ({ message: "Please confirm fair play commitment." }),
  }),
  understandsBan: z.literal(true, {
    errorMap: () => ({ message: "Please acknowledge the ban policy." }),
  }),
  agreesCoordinate: z.literal(true, {
    errorMap: () => ({ message: "Please agree to coordinate with admins." }),
  }),
  confirmsPayouts: z.literal(true, {
    errorMap: () => ({ message: "Please confirm payout approval policy." }),
  }),
  confirmsMobile: z.literal(true, {
    errorMap: () => ({ message: "Please confirm your mobile number." }),
  }),
});

export type HostApplicationInput = z.infer<typeof hostApplicationSchema>;
