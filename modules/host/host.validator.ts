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
});

export type HostApplicationInput = z.infer<typeof hostApplicationSchema>;
