import { Types } from "mongoose";

export enum FileType {
  PROFILE = "PROFILE",
  RESULT_SCREENSHOT = "RESULT_SCREENSHOT",
  OTHER = "OTHER",
}

export interface FileMetadata {
  _id?: Types.ObjectId | string;
  fileId: string;
  publicId: string;
  url: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  type: FileType;
  createdAt?: Date | string;
}
