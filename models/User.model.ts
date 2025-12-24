import mongoose, { Schema, Model } from "mongoose";
import { UserRole } from "@/enums/UserRole.enum";
import { User } from "@/types/user.types";

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.PLAYER },
    ageVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);
