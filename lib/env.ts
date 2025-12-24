import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  PHONEPE_WEBHOOK_SECRET: z.string().min(16),
});

export type Env = z.infer<typeof envSchema>;

export const getEnv = (): Env => {
  const parsed = envSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    PHONEPE_WEBHOOK_SECRET: process.env.PHONEPE_WEBHOOK_SECRET,
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
  }

  return parsed.data;
};
