export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getMatchBySlug } from "@/modules/matches/match.service";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchDetailsCard } from "@/components/match/MatchDetailsCard";
import ResultSubmissionCard from "@/components/match/ResultSubmissionCard";
import RegisterButton from "@/components/matches/RegisterButton";
import AdminManualRegisterButton from "@/components/admin/AdminManualRegisterButton";
import { Match } from "@/types/match.types";
import { requireUser } from "@/lib/auth.server";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import StartMatchButton from "@/components/matches/StartMatchButton";
import { UserRole } from "@/enums/UserRole.enum";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { MatchResultSubmissionModel } from "@/models/MatchResultSubmission.model";
import { ResultStatus } from "@/enums/ResultStatus.enum";
import ResultSubmissionsAdminTable from "@/components/match/ResultSubmissionsAdminTable";
import { RegistrationModel } from "@/models/Registration.model";
import { ACTIVE_REG_STATUSES } from "@/modules/registrations/registration.service";
import { UserModel } from "@/models/User.model";

const MatchDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  if (!slug) return notFound();

  let userId: string | null = null;
  let userRole: UserRole | null = null;
  try {
    const user = await requireUser();
    userId = user.userId;
    userRole = user.role;
  } catch {
    // not logged in
  }

  const match = await getMatchBySlug(slug, userId);
  if (!match) return notFound();

  const clientMatch: Match = {
    ...match,
    _id: match._id ? (match._id as any).toString() : undefined,
    startTime: match.startTime ? new Date(match.startTime).toISOString() : match.startTime,
  };
  const isRegistered = match.isRegistered === true;
  const registrationStatus = isRegistered ? RegistrationStatus.CONFIRMED : null;
  const canStart = (userId && match.createdBy === userId) || userRole === UserRole.ADMIN;
  const showStartButton = canStart && match.status === MatchStatus.UPCOMING;
  const isAdmin = userRole === UserRole.ADMIN;

  let submissions: { userId?: string; teamName?: string; status: ResultStatus; screenshotUrl: string; submittedAt: string; submissionId?: string; placement?: number; kills?: number; totalScore?: number }[] = [];
  if (isAdmin) {
    try {
      const records = await MatchResultSubmissionModel.find({ matchId: match.matchId }).lean();
      const userIds = records.map((r) => r.userId).filter(Boolean) as string[];
      const regDocs = await RegistrationModel.find({
        matchId: match.matchId,
        userId: { $in: userIds },
      }).lean();
      const teamByUser = new Map(regDocs.map((r) => [r.userId, r.teamName]));
      const users = await UserModel.find({ _id: { $in: userIds } }).lean();
      const nameByUser = new Map(users.map((u: any) => [u._id?.toString?.() ?? "", u.name]));

      submissions = records.map((r) => ({
        submissionId: r._id?.toString(),
        userId: r.userId,
        teamName: teamByUser.get(r.userId) || nameByUser.get(r.userId),
        status: r.status as ResultStatus,
        screenshotUrl: r.screenshotUrl,
        submittedAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        placement: r.placement,
        kills: r.kills,
        totalScore: r.totalScore,
      }));
    } catch {
      submissions = [];
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-6 text-[var(--text-primary)]">
      <MatchHeader match={clientMatch} />
      <MatchDetailsCard match={clientMatch} />
      {isAdmin ? (
        <ResultSubmissionsAdminTable submissions={submissions} matchId={match.matchId} />
      ) : (
        <ResultSubmissionCard matchId={match.matchId} matchStatus={match.status} isRegistered={isRegistered} />
      )}
      <div className="space-y-3">
        {showStartButton && <StartMatchButton matchId={match.matchId} />}
        <RegisterButton match={clientMatch} registrationStatus={registrationStatus} isRegistered={isRegistered} />
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <AdminManualRegisterButton matchId={match.matchId} buttonVariant="primary" fullWidth />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsPage;
