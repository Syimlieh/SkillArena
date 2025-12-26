import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth.server";

export const GET = async () => {
  try {
    const user = await requireUser();
    return NextResponse.json({
      profile: {
        id: user.userId,
        name: user.name ?? "User",
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error?.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
};
