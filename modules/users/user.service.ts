import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { SafeUser, User } from "@/types/user.types";

const toSafeUser = (user: User): SafeUser => {
  // Ensure password never leaks to calling code
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user;
  return safeUser;
};

export const findOrCreateUser = async (
  email: string,
  phone: string,
  name: string,
  passwordHash: string
): Promise<SafeUser> => {
  await connectDb();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();
  const existing = await UserModel.findOne({
    $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
  }).lean<User>();
  if (existing) return toSafeUser(existing);
  const created = await UserModel.create({
    email: normalizedEmail,
    phone: normalizedPhone,
    name,
    password: passwordHash,
    ageVerified: true,
  });
  return toSafeUser(created.toObject());
};

export const listPlayers = async (): Promise<SafeUser[]> => {
  await connectDb();
  const users = await UserModel.find().lean();

  if (!users.length) return [];
  return users.map(toSafeUser);
};
