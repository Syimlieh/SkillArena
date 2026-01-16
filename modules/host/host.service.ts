import { HostApplicationStatus } from "@/enums/HostApplicationStatus.enum";
import { UserRole } from "@/enums/UserRole.enum";
import { connectDb } from "@/lib/db";
import { HostApplicationModel } from "@/models/HostApplication.model";
import { UserModel } from "@/models/User.model";
import { HostApplicationInput } from "@/modules/host/host.validator";
import { HostApplication } from "@/types/host.types";

export class HostApplicationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const applyForHost = async (userId: string, role: UserRole, input: HostApplicationInput) => {
  await connectDb();
  if (role !== UserRole.USER) {
    throw new HostApplicationError("Only players can apply to host", 403);
  }

  const user = await UserModel.findById(userId).lean();
  if (!user?.phone) {
    throw new HostApplicationError("A valid mobile number is required to apply", 400);
  }

  const existingPending = await HostApplicationModel.findOne({
    userId,
    status: HostApplicationStatus.PENDING,
  });
  if (existingPending) {
    throw new HostApplicationError("You already have a pending application", 409);
  }

  const created = await HostApplicationModel.create({
    userId,
    displayName: input.displayName,
    description: input.description,
    contactEmail: input.contactEmail,
    hasHostedBefore: input.hasHostedBefore,
    understandsRules: input.understandsRules,
    agreesFairPlay: input.agreesFairPlay,
    understandsBan: input.understandsBan,
    agreesCoordinate: input.agreesCoordinate,
    confirmsPayouts: input.confirmsPayouts,
    confirmsMobile: input.confirmsMobile,
    status: HostApplicationStatus.PENDING,
  });

  return created.toObject();
};

export const listHostApplications = async (status?: HostApplicationStatus): Promise<HostApplication[]> => {
  await connectDb();
  const query = status ? { status } : {};
  const apps = await HostApplicationModel.find(query).sort({ createdAt: -1 }).lean();
  return apps as HostApplication[];
};

const updateApplicationStatus = async (
  id: string,
  status: HostApplicationStatus,
  adminComment?: string
): Promise<HostApplication | null> => {
  await connectDb();
  return HostApplicationModel.findByIdAndUpdate(
    id,
    { status, adminComment, reviewedAt: new Date() },
    { new: true }
  ).lean<HostApplication | null>();
};

export const approveApplication = async (id: string): Promise<HostApplication> => {
  const app = await updateApplicationStatus(id, HostApplicationStatus.APPROVED);
  if (!app) throw new HostApplicationError("Application not found", 404);

  // promote user to HOST
  await UserModel.findOneAndUpdate(
    { _id: app.userId },
    { role: UserRole.HOST, phoneLocked: true, hostApprovedAt: new Date() }
  );

  return app;
};

export const rejectApplication = async (id: string, adminComment?: string): Promise<HostApplication> => {
  const app = await updateApplicationStatus(id, HostApplicationStatus.REJECTED, adminComment);
  if (!app) throw new HostApplicationError("Application not found", 404);
  return app;
};
