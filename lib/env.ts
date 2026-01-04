import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  PHONEPE_WEBHOOK_SECRET: z.string().min(16),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  DO_SPACES_ACCESS_TOKEN: z.string().min(1, "DO_SPACES_ACCESS_TOKEN is required"),
  DO_SPACES_BUCKET: z.string().min(1, "DO_SPACES_BUCKET is required"),
  DO_SPACES_REGION: z.string().min(1, "DO_SPACES_REGION is required"),
  DO_SPACES_ORIGIN_ENDPOINT: z.string().url("DO_SPACES_ORIGIN_ENDPOINT must be a valid URL"),
  DO_SPACES_KEY: z.string().min(1, "DO_SPACES_KEY is required"),
});

export type Env = z.infer<typeof envSchema>;

export const getEnv = (): Env => {
  const parsed = envSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    PHONEPE_WEBHOOK_SECRET: process.env.PHONEPE_WEBHOOK_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
    
    DO_SPACES_ACCESS_TOKEN: process.env.DO_SPACES_ACCESS_TOKEN,
    DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET,
    DO_SPACES_REGION: process.env.DO_SPACES_REGION,
    DO_SPACES_ORIGIN_ENDPOINT: process.env.DO_SPACES_ORIGIN_ENDPOINT,
    DO_SPACES_KEY: process.env.DO_SPACES_KEY,
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment variables: ${details}`);
  }

  return parsed.data;
};
