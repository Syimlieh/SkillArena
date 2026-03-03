import { connectDb } from "@/lib/db";
import { MatchModel } from "@/models/Match.model";
import { MatchRequestModel } from "@/models/MatchRequest.model";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MatchRequestStatus } from "@/enums/MatchRequestStatus.enum";

export type AdminDashboardStats = {
  ongoingCount: number;
  upcomingCount: number;
  completedCount: number;
  pendingRequestsCount: number;
};

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  await connectDb();
  const [ongoingCount, upcomingCount, completedCount, pendingRequestsCount] = await Promise.all([
    MatchModel.countDocuments({ status: MatchStatus.ONGOING }),
    MatchModel.countDocuments({ status: MatchStatus.UPCOMING }),
    MatchModel.countDocuments({ status: MatchStatus.COMPLETED }),
    MatchRequestModel.countDocuments({ status: MatchRequestStatus.OPEN }),
  ]);
  return { ongoingCount, upcomingCount, completedCount, pendingRequestsCount };
};
