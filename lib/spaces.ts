import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import { getEnv } from "@/lib/env";
import { FileMetadata } from "@/types/file.types";

const { DO_SPACES_REGION, DO_SPACES_ORIGIN_ENDPOINT, DO_SPACES_ACCESS_TOKEN, DO_SPACES_KEY, DO_SPACES_BUCKET } = getEnv();

// Ensure endpoint does not contain bucket; Spaces expects origin endpoint like https://sgp1.digitaloceanspaces.com
const normalizedEndpoint = DO_SPACES_ORIGIN_ENDPOINT.replace(/\/+$/, "");

const spacesClient = new S3Client({
  region: DO_SPACES_REGION,
  endpoint: normalizedEndpoint,
  credentials: {
    accessKeyId: DO_SPACES_KEY,
    secretAccessKey: DO_SPACES_ACCESS_TOKEN,
  },
  forcePathStyle: false,
});

export const uploadToSpaces = async (file: File, folder = "profiles"): Promise<FileMetadata> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name || "") || ".png";
  const fileId = randomUUID();
  const key = `${folder}/${fileId}${ext}`.replace(/^\/+/, "");

  await spacesClient.send(
    new PutObjectCommand({
      Bucket: DO_SPACES_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type || "image/png",
      ACL: "public-read",
    })
  );

  return {
    fileId,
    publicId: key,
    url: `${normalizedEndpoint}/${DO_SPACES_BUCKET}/${key}`,
    format: ext.replace(".", ""),
    bytes: buffer.byteLength,
  };
};
