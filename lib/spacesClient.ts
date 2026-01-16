import { S3Client } from "@aws-sdk/client-s3";
import { getEnv } from "@/lib/env";

const { DO_SPACES_REGION, DO_SPACES_ORIGIN_ENDPOINT, DO_SPACES_KEY, DO_SPACES_ACCESS_TOKEN } = getEnv();

const normalizedEndpoint = DO_SPACES_ORIGIN_ENDPOINT.replace(/\/+$/, "");

export const spacesClient = new S3Client({
  region: DO_SPACES_REGION,
  endpoint: normalizedEndpoint,
  credentials: {
    accessKeyId: DO_SPACES_KEY,
    secretAccessKey: DO_SPACES_ACCESS_TOKEN,
  },
  forcePathStyle: false,
});
