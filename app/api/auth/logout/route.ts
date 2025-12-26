import { NextResponse } from "next/server";
import { SECURITY } from "@/lib/constants";

export const POST = async () => {
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
};
