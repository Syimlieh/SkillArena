import { NextResponse } from "next/server";
import { SECURITY } from "@/lib/constants";
import { withApiLogger } from "@/lib/api-logger";

export const POST = withApiLogger("api-auth-logout", "POST", async () => {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SECURITY.authCookie,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
});
