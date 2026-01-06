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
  profileFileId: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(64),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
});

const passwordSchema = z.string().min(8).max(64);

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(10),
  password: passwordSchema,
});

export const passwordResetFormSchema = z
  .object({
    token: z.string().min(10, "Reset link is invalid"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((val) => val.password === val.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;
