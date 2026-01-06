import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { uploadToSpaces } from "@/lib/spaces";
import { FileMetadataModel } from "@/models/FileMetadata.model";
import { connectDb } from "@/lib/db";
import { FileType } from "@/types/file.types";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = typeof formData.get("folder") === "string" ? String(formData.get("folder")) : undefined;
    const typeParam = typeof formData.get("type") === "string" ? String(formData.get("type")) : undefined;
    const fileType = typeParam && Object.values(FileType).includes(typeParam as FileType) ? (typeParam as FileType) : FileType.OTHER;

    if (!(file instanceof File)) {
      return errorResponse("File is required", 400);
    }
    if (!file.type.startsWith("image/")) {
      return errorResponse("Only image uploads are allowed", 400);
    }
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse("Image must be 5MB or smaller", 400);
    }

    const targetFolder =
      folder ||
      (fileType === FileType.PROFILE ? "profiles" : fileType === FileType.RESULT_SCREENSHOT ? "results" : "uploads");

    const uploaded = await uploadToSpaces(file, targetFolder, fileType);

    await connectDb();
    await FileMetadataModel.create({
      fileId: uploaded.fileId,
      publicId: uploaded.publicId,
      url: uploaded.url,
      format: uploaded.format,
      bytes: uploaded.bytes,
      type: fileType,
    });

    return successResponse(
      { fileId: uploaded.fileId, url: uploaded.url, type: fileType },
      { status: 201 }
    );
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Upload error:", err?.message || err);
    }
    return errorResponse("Unable to upload image", 500);
  }
};
