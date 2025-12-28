import { NextRequest } from "next/server";
import { handleHostApply } from "@/modules/host/host.controller";

export const POST = (req: NextRequest) => handleHostApply(req);
