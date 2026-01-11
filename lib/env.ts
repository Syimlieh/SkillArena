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
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .pipe(z.number().optional()),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((val) => (val ? val === "true" : undefined))
    .pipe(z.boolean().optional()),
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
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_SECURE: process.env.SMTP_SECURE,
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment variables: ${details}`);
  }

  return parsed.data;
};
