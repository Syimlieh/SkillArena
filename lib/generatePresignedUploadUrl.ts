import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { getEnv } from "@/lib/env";
import { spacesClient } from "@/lib/spacesClient";
import { FileType } from "@/types/file.types";

const { DO_SPACES_BUCKET, DO_SPACES_ORIGIN_ENDPOINT } = getEnv();

const normalizeEndpoint = (endpoint: string) => endpoint.replace(/\/+$/, "");

const resolveExtension = (contentType: string) => {
  switch (contentType) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/jpeg":
    case "image/jpg":
    default:
      return ".jpg";
  }
};

export const generatePresignedUploadUrl = async ({
  folder,
  contentType,
  fileType,
}: {
  folder: string;
  contentType: string;
  fileType: FileType;
}) => {
  const fileId = randomUUID();
  const ext = resolveExtension(contentType);
  const key = `${folder}/${fileId}${ext}`.replace(/^\/+/, "");
  const isProfile = fileType === FileType.PROFILE;
  const command = new PutObjectCommand({
    Bucket: DO_SPACES_BUCKET,
    Key: key,
    ACL: isProfile ? "public-read" : "private",
  });

  const uploadUrl = await getSignedUrl(spacesClient, command, { expiresIn: 300 });
  const publicUrl = `${normalizeEndpoint(DO_SPACES_ORIGIN_ENDPOINT)}/${key}`;

  return {
    fileId,
    key,
    uploadUrl,
    publicUrl,
    requiredHeaders: {
      "Content-Type": contentType,
    },
  };
};
