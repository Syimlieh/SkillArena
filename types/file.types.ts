import { Types } from "mongoose";

export interface FileMetadata {
  _id?: Types.ObjectId | string;
  fileId: string;
  publicId: string;
  url: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  createdAt?: Date | string;
}
