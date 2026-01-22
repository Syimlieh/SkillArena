import { z } from "zod";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectDb } from "@/lib/db";
import { getSpacesPublicUrl } from "@/lib/spaces";
import { FileMetadataModel } from "@/models/FileMetadata.model";
import { FileType } from "@/types/file.types";
import { withApiLogger } from "@/lib/api-logger";

export const dynamic = "force-dynamic";

const completeSchema = z.object({
  fileId: z.string().min(1),
  key: z.string().min(1),
  bytes: z.number().int().nonnegative().optional(),
  format: z.string().optional(),
  type: z.nativeEnum(FileType).optional(),
});

export const POST = withApiLogger("api-uploads-complete", "POST", async (req: Request) => {
  try {
    const payload = await req.json().catch(() => ({}));
    const parsed = completeSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return errorResponse("Invalid upload completion", 400, { fieldErrors });
    }

    const { fileId, key, bytes, format, type } = parsed.data;
    const resolvedType = type ?? FileType.OTHER;
    const url = getSpacesPublicUrl(key);

    await connectDb();
    await FileMetadataModel.create({
      fileId,
      publicId: key,
      url,
      format,
      bytes,
      type: resolvedType,
    });

    return successResponse({ fileId, url, type: resolvedType }, { status: 201 });
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Upload completion error:", err?.message || err);
    }
    return errorResponse("Unable to finalize upload", 500);
  }
});
