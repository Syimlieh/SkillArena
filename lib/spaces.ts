import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";
import { getEnv } from "@/lib/env";
import { FileMetadata, FileType } from "@/types/file.types";

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

export const uploadToSpaces = async (
  file: File,
  folder = "profiles",
  type: FileType = FileType.PROFILE
): Promise<FileMetadata> => {
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
    url: getSpacesPublicUrl(key),
    format: ext.replace(".", ""),
    bytes: buffer.byteLength,
    type,
  };
};

const inferExtension = (fileName: string, contentType?: string) => {
  const ext = path.extname(fileName || "");
  if (ext) return ext;
  switch (contentType) {
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return ".png";
  }
};

export const getSpacesPublicUrl = (key: string) => {
  const safeKey = key.replace(/^\/+/, "");
  const endpointUrl = new URL(normalizedEndpoint);
  const host = `${DO_SPACES_BUCKET}.${endpointUrl.host}`;
  return `${endpointUrl.protocol}//${host}/${safeKey}`;
};

export const createPresignedUpload = async ({
  fileName,
  contentType,
  folder = "uploads",
  type = FileType.OTHER,
  expiresIn = 300,
}: {
  fileName: string;
  contentType: string;
  folder?: string;
  type?: FileType;
  expiresIn?: number;
}) => {
  const ext = inferExtension(fileName, contentType);
  const fileId = randomUUID();
  const key = `${folder}/${fileId}${ext}`.replace(/^\/+/, "");
  const isProfile = type === FileType.PROFILE;
  const command = new PutObjectCommand({
    Bucket: DO_SPACES_BUCKET,
    Key: key,
    ContentType: contentType,
    ...(isProfile ? { ACL: "public-read" } : {}),
  });
  const uploadUrl = await getSignedUrl(spacesClient, command, { expiresIn });
  return {
    fileId,
    key,
    uploadUrl,
    url: getSpacesPublicUrl(key),
    format: ext.replace(".", ""),
    type,
  };
};

export const createPresignedDownload = async (key: string, expiresIn = 300) =>
  getSignedUrl(
    spacesClient,
    new GetObjectCommand({
      Bucket: DO_SPACES_BUCKET,
      Key: key.replace(/^\/+/, ""),
    }),
    { expiresIn }
  );
