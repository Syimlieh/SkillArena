import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { Types } from "mongoose";

export interface Scrim {
  _id?: Types.ObjectId;
  title: string;
  entryFee: number;
  maxSlots: number;
  prizePool: number;
  status: ScrimStatus;
  startTime: Date;
  roomId?: string;
  roomPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScrimJoinPayload {
  scrimId: string;
  userId: string;
  paymentId?: string;
}
