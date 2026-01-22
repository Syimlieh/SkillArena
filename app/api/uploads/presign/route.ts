import { z } from "zod";
import { errorResponse, successResponse } from "@/lib/api-response";
import { createPresignedUpload } from "@/lib/spaces";
import { FileType } from "@/types/file.types";
import { withApiLogger } from "@/lib/api-logger";

export const dynamic = "force-dynamic";

const presignSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().int().positive(),
  folder: z.string().optional(),
  type: z.nativeEnum(FileType).optional(),
});

export const POST = withApiLogger("api-uploads-presign", "POST", async (req: Request) => {
  try {
    const payload = await req.json().catch(() => ({}));
    const parsed = presignSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return errorResponse("Invalid upload request", 400, { fieldErrors });
    }

    const { fileName, contentType, size, folder, type } = parsed.data;
    if (!contentType.startsWith("image/")) {
      return errorResponse("Only image uploads are allowed", 400);
    }
    if (size > 5 * 1024 * 1024) {
      return errorResponse("Image must be 5MB or smaller", 400);
    }

    const resolvedType = type ?? FileType.OTHER;
    const targetFolder =
      folder ||
      (resolvedType === FileType.PROFILE
        ? "profiles"
        : resolvedType === FileType.RESULT_SCREENSHOT
          ? "results"
          : "uploads");

    const presigned = await createPresignedUpload({
      fileName,
      contentType,
      folder: targetFolder,
      type: resolvedType,
    });

    const requiredHeaders: Record<string, string> = { "Content-Type": contentType };
    if (resolvedType === FileType.PROFILE) {
      requiredHeaders["x-amz-acl"] = "public-read";
    }

    return successResponse({
      fileId: presigned.fileId,
      key: presigned.key,
      uploadUrl: presigned.uploadUrl,
      url: presigned.url,
      format: presigned.format,
      type: presigned.type,
      requiredHeaders,
    });
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Presign error:", err?.message || err);
    }
    return errorResponse("Unable to prepare upload", 500);
  }
});
