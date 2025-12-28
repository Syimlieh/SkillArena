import { Types } from "mongoose";
import { HostApplicationStatus } from "@/enums/HostApplicationStatus.enum";

export interface HostApplication {
  _id?: Types.ObjectId;
  userId: string;
  displayName: string;
  description: string;
  contactEmail: string;
  status: HostApplicationStatus;
  adminComment?: string;
  createdAt?: Date;
  reviewedAt?: Date;
}

export interface HostApplicationPayload {
  displayName: string;
  description: string;
  contactEmail: string;
}
