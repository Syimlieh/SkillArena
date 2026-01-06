import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDb } from "@/lib/db";
import { sendResetPasswordEmail } from "@/lib/email/mailer";
import { PasswordResetTokenModel } from "@/models/PasswordResetToken.model";
import { UserModel } from "@/models/User.model";
import { SALT_ROUNDS, sanitizeUser } from "@/modules/auth/auth.service";
import { SafeUser, User } from "@/types/user.types";

const RESET_TOKEN_TTL_MINUTES = 30;

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export class PasswordResetError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const requestPasswordReset = async (email: string, origin: string): Promise<void> => {
  await connectDb();
  const normalizedEmail = email.trim().toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail }).lean<User>();

  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

  await PasswordResetTokenModel.deleteMany({ userId: user._id });
  await PasswordResetTokenModel.create({ userId: user._id, tokenHash, expiresAt });

  const resetUrl = `${origin.replace(/\/$/, "")}/auth/reset?token=${token}`;
  await sendResetPasswordEmail(user.email, { name: user.name, resetUrl });
};

export const resetPasswordWithToken = async (token: string, password: string): Promise<SafeUser> => {
  await connectDb();
  const tokenHash = hashToken(token);
  const tokenDoc = await PasswordResetTokenModel.findOne({ tokenHash }).lean<{
    _id: string;
    userId: string;
    expiresAt: Date;
  }>();

  if (!tokenDoc || tokenDoc.expiresAt.getTime() < Date.now()) {
    if (tokenDoc?._id) {
      await PasswordResetTokenModel.deleteOne({ _id: tokenDoc._id });
    }
    throw new PasswordResetError("Invalid or expired reset link", 400);
  }

  const user = await UserModel.findById(tokenDoc.userId).select("+password").lean<User>();
  if (!user) {
    await PasswordResetTokenModel.deleteMany({ userId: tokenDoc.userId });
    throw new PasswordResetError("Invalid reset token", 400);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await UserModel.updateOne({ _id: user._id }, { password: passwordHash });
  await PasswordResetTokenModel.deleteMany({ userId: user._id });

  return sanitizeUser({ ...user, password: passwordHash });
};
