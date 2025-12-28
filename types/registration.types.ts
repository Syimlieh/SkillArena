import { Types } from "mongoose";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";

export interface Registration {
  _id?: Types.ObjectId;
  userId: string;
  matchId: string;
  status: RegistrationStatus;
  createdAt?: Date;
  expiresAt?: Date;
}

export interface RegistrationResult {
  registration: Registration;
  matchId: string;
}
