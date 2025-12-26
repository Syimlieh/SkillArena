import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { ScrimMap } from "@/enums/ScrimMap.enum";
import { Types } from "mongoose";

export interface Scrim {
  _id?: Types.ObjectId;
  slug?: string;
  title: string;
  entryFee: number;
  maxSlots: number;
  availableSlots?: number;
  prizePool: number;
  status: ScrimStatus;
  map?: ScrimMap;
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
