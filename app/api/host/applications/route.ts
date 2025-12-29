import { NextRequest } from "next/server";
import { handleListHostApplications } from "@/modules/host/host.controller";

export const GET = (req: NextRequest) => handleListHostApplications(req);
