import { UserRole } from "@/enums/UserRole.enum";
import { Types } from "mongoose";

export interface User {
  _id?: Types.ObjectId;
  name: string;
  phone: string;
  role: UserRole;
  ageVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
