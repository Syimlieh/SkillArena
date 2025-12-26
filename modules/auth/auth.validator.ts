import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().trim().toLowerCase(),
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\+?[0-9]{10,15}$/, "Phone must be 10-15 digits, optionally starting with +"),
  password: z.string().min(8).max(64),
  ageVerified: z.boolean(),
});

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(64),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
