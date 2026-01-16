import crypto from "crypto";
import { connectDb } from "@/lib/db";
import { sendVerifyEmail } from "@/lib/email/mailer";
import { EmailVerificationTokenModel } from "@/models/EmailVerificationToken.model";
import { UserModel } from "@/models/User.model";
import { User } from "@/types/user.types";

const VERIFY_TOKEN_TTL_MINUTES = 60;

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export class EmailVerificationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const requestEmailVerification = async (userId: string, origin: string): Promise<void> => {
  await connectDb();
  const user = await UserModel.findById(userId).lean<User>();
  if (!user) {
    throw new EmailVerificationError("User not found", 404);
  }
  if (user.emailVerified) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_MINUTES * 60 * 1000);

  await EmailVerificationTokenModel.deleteMany({ userId: user._id });
  await EmailVerificationTokenModel.create({ userId: user._id, tokenHash, expiresAt });

  const verifyUrl = `${origin.replace(/\/$/, "")}/auth/verify?token=${token}`;
  await sendVerifyEmail(user.email, { name: user.name, verifyUrl });
};

export const verifyEmailWithToken = async (token: string): Promise<void> => {
  await connectDb();
  const tokenHash = hashToken(token);
  const tokenDoc = await EmailVerificationTokenModel.findOne({ tokenHash }).lean<{
    _id: string;
    userId: string;
    expiresAt: Date;
  }>();

  if (!tokenDoc || tokenDoc.expiresAt.getTime() < Date.now()) {
    if (tokenDoc?._id) {
      await EmailVerificationTokenModel.deleteOne({ _id: tokenDoc._id });
    }
    throw new EmailVerificationError("Invalid or expired verification link", 400);
  }

  await UserModel.updateOne(
    { _id: tokenDoc.userId },
    { $set: { emailVerified: true, emailVerifiedAt: new Date() } }
  );
  await EmailVerificationTokenModel.deleteMany({ userId: tokenDoc.userId });
};
