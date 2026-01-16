import { Types } from "mongoose";
import { HostApplicationStatus } from "@/enums/HostApplicationStatus.enum";

export interface HostApplication {
  _id?: Types.ObjectId;
  userId: string;
  displayName: string;
  description: string;
  contactEmail: string;
  hasHostedBefore: boolean;
  understandsRules: boolean;
  agreesFairPlay: boolean;
  understandsBan: boolean;
  agreesCoordinate: boolean;
  confirmsPayouts: boolean;
  confirmsMobile: boolean;
  status: HostApplicationStatus;
  adminComment?: string;
  createdAt?: Date;
  reviewedAt?: Date;
}

export interface HostApplicationPayload {
  displayName: string;
  description: string;
  contactEmail: string;
  hasHostedBefore: boolean;
  understandsRules: boolean;
  agreesFairPlay: boolean;
  understandsBan: boolean;
  agreesCoordinate: boolean;
  confirmsPayouts: boolean;
  confirmsMobile: boolean;
}
