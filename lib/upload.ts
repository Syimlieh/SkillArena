import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const validateImageFile = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG or PNG images are allowed.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be 5MB or smaller.");
  }
};

export const saveImageUpload = async (file: File, folder = "results"): Promise<string> => {
  validateImageFile(file);
  const buffer = Buffer.from(await file.arrayBuffer());

  const ext = file.type === "image/png" ? "png" : "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });
  const targetPath = path.join(uploadDir, filename);
  await fs.writeFile(targetPath, buffer);

  // Public URL relative to the Next.js public folder
  return `/uploads/${folder}/${filename}`;
};
