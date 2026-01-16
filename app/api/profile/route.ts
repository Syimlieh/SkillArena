import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth.server";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { UserRole } from "@/enums/UserRole.enum";
import { FileMetadataModel } from "@/models/FileMetadata.model";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(8).max(20).optional(),
  profileFileId: z.string().trim().optional(),
});

const buildProfileResponse = async (userId: string) => {
  await connectDb();
  const user = await UserModel.findById(userId).lean();
  if (!user) return null;
  let avatarUrl: string | undefined;
  if (user.profileFileId) {
    const meta = await FileMetadataModel.findOne({ fileId: user.profileFileId }).lean();
    avatarUrl = meta?.url;
  }
  return {
    id: user._id?.toString() ?? userId,
    name: user.name ?? "User",
    email: user.email,
    phone: user.phone,
    role: user.role,
    phoneLocked: user.phoneLocked ?? false,
    profileFileId: user.profileFileId,
    avatarUrl,
    emailVerified: user.emailVerified ?? false,
  };
};

export const GET = async () => {
  try {
    const user = await requireUser();
    const profile = await buildProfileResponse(user.userId);
    return NextResponse.json({ profile });
  } catch (error: any) {
    if (error?.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
};

export const PATCH = async (req: Request) => {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => ({}));
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Invalid input", fieldErrors }, { status: 400 });
    }

    await connectDb();
    if (parsed.data.phone !== undefined) {
      const existing = await UserModel.findById(user.userId).lean();
      if (existing?.phoneLocked || existing?.role === UserRole.HOST) {
        return NextResponse.json({ error: "Phone number is locked" }, { status: 403 });
      }
    }
    const updates: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
    if (parsed.data.profileFileId !== undefined) updates.profileFileId = parsed.data.profileFileId || undefined;

    try {
      await UserModel.updateOne({ _id: user.userId }, { $set: updates }).lean();
    } catch (err: any) {
      if (err?.code === 11000) {
        const duplicateField = Object.keys(err?.keyPattern ?? {})[0] ?? "field";
        return NextResponse.json({ error: `${duplicateField} already in use` }, { status: 409 });
      }
      throw err;
    }
    const profile = await buildProfileResponse(user.userId);
    return NextResponse.json({ profile });
  } catch (error: any) {
    if (error?.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
};
