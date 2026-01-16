import mongoose, { Schema, Model } from "mongoose";
import { UserRole } from "@/enums/UserRole.enum";
import { User } from "@/types/user.types";

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, unique: true, trim: true },
    profileFileId: { type: String },
    phoneLocked: { type: Boolean, default: false },
    hostApprovedAt: { type: Date },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    ageVerified: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);


export const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);
