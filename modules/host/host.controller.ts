import { NextRequest } from "next/server";
import { requireAdmin, requireUser } from "@/lib/auth.server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { hostApplicationSchema } from "@/modules/host/host.validator";
import {
  applyForHost,
  approveApplication,
  HostApplicationError,
  listHostApplications,
  rejectApplication,
} from "@/modules/host/host.service";
import { HostApplicationStatus } from "@/enums/HostApplicationStatus.enum";

export const handleHostApply = async (req: NextRequest) => {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = hostApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid application data", 400, {
        code: "INVALID_INPUT",
        fieldErrors: parsed.error.flatten().fieldErrors,
      });
    }
    const app = await applyForHost(user.userId, user.role, parsed.data);
    return successResponse({ application: app }, { status: 201 });
  } catch (error: any) {
    if (error instanceof HostApplicationError) {
      return errorResponse(error.message, error.statusCode, { code: "HOST_APPLICATION_ERROR" });
    }
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to submit application", 500);
  }
};

export const handleListHostApplications = async (req: NextRequest) => {
  try {
    await requireAdmin();
    const statusParam = req.nextUrl.searchParams.get("status");
    const status =
      statusParam && Object.values(HostApplicationStatus).includes(statusParam as HostApplicationStatus)
        ? (statusParam as HostApplicationStatus)
        : undefined;
    const apps = await listHostApplications(status);
    return successResponse({ applications: apps });
  } catch (error: any) {
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to fetch applications", 500);
  }
};

export const handleApproveHostApplication = async (_req: NextRequest, params: Promise<{ id: string }>) => {
  try {
    await requireAdmin();
    const { id } = await params;
    const app = await approveApplication(id);
    return successResponse({ application: app });
  } catch (error: any) {
    if (error instanceof HostApplicationError) {
      return errorResponse(error.message, error.statusCode, { code: "HOST_APPLICATION_ERROR" });
    }
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to approve application", 500);
  }
};

export const handleRejectHostApplication = async (
  req: NextRequest,
  params: Promise<{ id: string }>
) => {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const comment = typeof body?.adminComment === "string" ? body.adminComment : undefined;
    const app = await rejectApplication(id, comment);
    return successResponse({ application: app });
  } catch (error: any) {
    if (error instanceof HostApplicationError) {
      return errorResponse(error.message, error.statusCode, { code: "HOST_APPLICATION_ERROR" });
    }
    if (error?.message === "Unauthorized") return errorResponse("Unauthorized", 401);
    if (error?.message === "Forbidden") return errorResponse("Forbidden", 403);
    return errorResponse("Unable to reject application", 500);
  }
};
