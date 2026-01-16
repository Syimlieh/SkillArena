import apiClient from "@/lib/apiClient";
import { FileType } from "@/types/file.types";

interface PresignPayload {
  fileName: string;
  contentType: string;
  size: number;
  folder?: string;
  type: FileType;
}

interface PresignResponse {
  uploadUrl: string;
  fileId: string;
  key: string;
  url: string;
  format?: string;
  requiredHeaders?: Record<string, string>;
}

interface CompleteResponse {
  fileId: string;
  url: string;
  type: FileType;
}

export const uploadImageDirect = async (
  file: File,
  options: { type: FileType; folder?: string }
): Promise<CompleteResponse> => {
  const presignRes = await apiClient.post("/api/uploads/presign", {
    fileName: file.name,
    contentType: file.type,
    size: file.size,
    type: options.type,
    folder: options.folder,
  } satisfies PresignPayload);
  const presign = presignRes.data?.data as PresignResponse | undefined;
  if (!presign) {
    throw new Error("Unable to prepare upload.");
  }
  const headers: Record<string, string> =
    presign.requiredHeaders ?? (file.type ? { "Content-Type": file.type } : {});

  let putRes: Response;
  try {
    putRes = await fetch(presign.uploadUrl, {
      method: "PUT",
      headers,
      body: file,
    });
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Upload blocked. Check Spaces CORS for this origin.");
    }
    throw err;
  }

  if (!putRes.ok) {
    throw new Error("Unable to upload image.");
  }

  const completeRes = await apiClient.post("/api/uploads/complete", {
    fileId: presign.fileId,
    key: presign.key,
    bytes: file.size,
    format: presign.format,
    type: options.type,
  });
  const completeData = completeRes.data?.data as CompleteResponse | undefined;
  if (!completeData) {
    throw new Error("Unable to finalize upload.");
  }
  return completeData;
};
