import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth.server";
import { UserModel } from "@/models/User.model";
import { withApiLogger } from "@/lib/api-logger";

export const GET = withApiLogger("api-admin-users-search", "GET", async (req: NextRequest) => {
  try {
    await requireAdmin();
    await connectDb();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const match: any = {
      role: { $ne: "ADMIN" },
      ...(q
        ? {
            $or: [
              { name: { $regex: q, $options: "i" } },
              { email: { $regex: q, $options: "i" } },
              { phone: { $regex: q, $options: "i" } },
            ],
          }
        : {}),
    };
    const users = await UserModel.find(match)
      .select({ _id: 1, name: 1, email: 1, phone: 1, role: 1 })
      .limit(20)
      .lean();
    return new Response(JSON.stringify({ success: true, data: { users } }), { status: 200 });
  } catch (error: any) {
    const status = error?.message === "Unauthorized" ? 401 : error?.message === "Forbidden" ? 403 : 500;
    return new Response(JSON.stringify({ success: false, error: "Unable to search users" }), { status });
  }
});
