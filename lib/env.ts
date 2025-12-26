import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  PHONEPE_WEBHOOK_SECRET: z.string().min(16),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

export type Env = z.infer<typeof envSchema>;

export const getEnv = (): Env => {
  const parsed = envSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    PHONEPE_WEBHOOK_SECRET: process.env.PHONEPE_WEBHOOK_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment variables: ${details}`);
  }

  return parsed.data;
};
