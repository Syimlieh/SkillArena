import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "@/enums/UserRole.enum";
import { getEnv } from "@/lib/env";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { LoginInput, RegisterInput } from "@/modules/auth/auth.validator";
import { SafeUser, User } from "@/types/user.types";

const SALT_ROUNDS = 10;

type TokenPayload = {
  userId: string;
  role: UserRole;
  email: string;
};

export class AuthServiceError extends Error {
  statusCode: number;
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, statusCode = 400, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

export const sanitizeUser = (user: User): SafeUser => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safe } = user;
  return safe;
};

const signToken = (payload: TokenPayload): string => {
  const { JWT_SECRET, JWT_EXPIRES_IN } = getEnv();
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const registerUser = async (
  input: RegisterInput
): Promise<{ user: SafeUser; token: string }> => {
  await connectDb();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const existing = await UserModel.findOne({ $or: [{ email }, { phone }] }).lean<User>();
  if (existing) {
    const field = existing.email === email ? "email" : "phone";
    throw new AuthServiceError(
      field === "email" ? "Email already registered" : "Phone already registered",
      409,
      { [field]: [`${field === "email" ? "Email" : "Phone"} already registered`] }
    );
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  let created: User;
  try {
    created = (
      await UserModel.create({
        name: input.name.trim(),
        email,
        phone,
        password: passwordHash,
        role: UserRole.USER,
        ageVerified: input.ageVerified,
      })
    ).toObject();
  } catch (error: any) {
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error?.keyPattern ?? {})[0] ?? "email";
      const message =
        duplicateField === "phone" ? "Phone already registered" : "Email already registered";
      throw new AuthServiceError(message, 409, { [duplicateField]: [message] });
    }
    throw error;
  }

  const safeUser = sanitizeUser(created);
  const token = signToken({
    userId: created._id?.toString() ?? "",
    role: safeUser.role,
    email: safeUser.email,
  });

  return { user: safeUser, token };
};

export const loginUser = async (
  input: LoginInput
): Promise<{ user: SafeUser; token: string }> => {
  await connectDb();
  const email = input.email.trim().toLowerCase();
  const user = await UserModel.findOne({ email }).select("+password").lean<User>();
  if (!user || !user.password) {
    throw new AuthServiceError("Invalid credentials", 401);
  }

  const isValid = await bcrypt.compare(input.password, user.password);
  if (!isValid) {
    throw new AuthServiceError("Invalid credentials", 401);
  }

  const safeUser = sanitizeUser(user);
  const token = signToken({
    userId: user._id?.toString() ?? "",
    role: safeUser.role,
    email: safeUser.email,
  });

  return { user: safeUser, token };
};

export const verifyAuthToken = (token: string): TokenPayload | null => {
  try {
    const { JWT_SECRET } = getEnv();
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};
