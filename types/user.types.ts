import { UserRole } from "@/enums/UserRole.enum";
import { Types } from "mongoose";

export interface User {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  ageVerified: boolean;
  profileFileId?: string;
  avatarUrl?: string;
  phoneLocked?: boolean;
  hostApprovedAt?: Date;
  emailVerified?: boolean;
  emailVerifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SafeUser = Omit<User, "password">;
