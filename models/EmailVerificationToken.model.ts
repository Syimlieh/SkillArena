import mongoose, { Model, Schema } from "mongoose";

export type EmailVerificationToken = {
  userId: Schema.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
};

const EmailVerificationTokenSchema = new Schema<EmailVerificationToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

EmailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailVerificationTokenModel: Model<EmailVerificationToken> =
  mongoose.models.EmailVerificationToken ||
  mongoose.model<EmailVerificationToken>("EmailVerificationToken", EmailVerificationTokenSchema);
