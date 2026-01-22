import { NextResponse } from "next/server";
import { verifyRole } from "@/lib/security";
import { UserRole } from "@/enums/UserRole.enum";
import { createScrim, listScrims } from "@/modules/scrims/scrim.service";
import { scrimSchema } from "@/modules/scrims/scrim.validator";
import { withApiLogger } from "@/lib/api-logger";

export const GET = withApiLogger("api-scrims", "GET", async () => {
  const scrims = await listScrims();
  return NextResponse.json(scrims);
});

export const POST = withApiLogger("api-scrims", "POST", async (req: Request) => {
  if (!verifyRole(req, [UserRole.ADMIN])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = scrimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await createScrim(parsed.data);
  return NextResponse.json(created, { status: 201 });
});
