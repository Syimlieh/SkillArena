import mongoose, { Model, Schema } from "mongoose";
import { FileMetadata, FileType } from "@/types/file.types";

const FileMetadataSchema = new Schema<FileMetadata>(
  {
    fileId: { type: String, required: true, unique: true, index: true },
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    format: { type: String },
    bytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    type: { type: String, enum: Object.values(FileType), default: FileType.OTHER },
  },
  { timestamps: true }
);

export const FileMetadataModel: Model<FileMetadata> =
  mongoose.models.FileMetadata || mongoose.model<FileMetadata>("FileMetadata", FileMetadataSchema);
