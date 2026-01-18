import { Types } from "mongoose";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";

export interface Registration {
  _id?: Types.ObjectId;
  userId: string;
  matchId: string;
  status: RegistrationStatus;
  teamName?: string;
  captainBgmiId?: string;
  captainIgn?: string;
  squadBgmiIds?: string[];
  lockedAt?: Date;
  lockedBy?: string;
  paymentReference?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentNote?: string;
  recordedBy?: string;
  createdAt?: Date;
  expiresAt?: Date;
}

export interface RegistrationResult {
  registration: Registration;
  matchId: string;
}
