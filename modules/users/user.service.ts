import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { User } from "@/types/user.types";

export const findOrCreateUser = async (phone: string, name: string): Promise<User> => {
  await connectDb();
  const existing = await UserModel.findOne({ phone });
  if (existing) return existing.toObject();
  const created = await UserModel.create({ phone, name, ageVerified: true });
  return created.toObject();
};

export const listPlayers = async (): Promise<User[]> => {
  await connectDb();
  return UserModel.find().lean();
};
