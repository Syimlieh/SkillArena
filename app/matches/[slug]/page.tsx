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
import { UserModel } from "@/models/User.model";
import { FileMetadataModel } from "@/models/FileMetadata.model";
import { createPresignedDownload } from "@/lib/spaces";
import { FileType } from "@/types/file.types";
import RegisteredUsersAdminTable from "@/components/match/RegisteredUsersAdminTable";

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
  let registeredUsers: { userId?: string; name?: string; email?: string; teamName?: string; status: RegistrationStatus; paymentAmount?: number; paymentMethod?: string; paymentReference?: string; registeredAt?: string }[] = [];
  if (isAdmin) {
    try {
      const registrations = await RegistrationModel.find({ matchId: match.matchId }).lean();
      const registeredUserIds = registrations.map((r) => r.userId).filter(Boolean) as string[];
      const users = registeredUserIds.length
        ? await UserModel.find({ _id: { $in: registeredUserIds } }).lean()
        : [];
      const nameByUser = new Map(users.map((u: any) => [u._id?.toString?.() ?? "", u.name]));
      const emailByUser = new Map(users.map((u: any) => [u._id?.toString?.() ?? "", u.email]));
      const teamByUser = new Map(registrations.map((r) => [r.userId, r.teamName]));

      registeredUsers = registrations.map((r) => ({
        userId: r.userId,
        name: nameByUser.get(r.userId),
        email: emailByUser.get(r.userId),
        teamName: r.teamName,
        status: r.status as RegistrationStatus,
        paymentAmount: r.paymentAmount,
        paymentMethod: r.paymentMethod,
        paymentReference: r.paymentReference,
        registeredAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
      }));

      const records = await MatchResultSubmissionModel.find({ matchId: match.matchId }).lean();
      const fileIds = records.map((r) => r.fileId).filter(Boolean) as string[];
      const fileMetaDocs = fileIds.length
        ? await FileMetadataModel.find({ fileId: { $in: fileIds } }).lean()
        : [];
      const fileMetaById = new Map(fileMetaDocs.map((doc) => [doc.fileId, doc]));

      submissions = await Promise.all(
        records.map(async (r) => {
          const fileMeta = r.fileId ? fileMetaById.get(r.fileId) : undefined;
          const screenshotUrl =
            fileMeta?.publicId && fileMeta.type === FileType.RESULT_SCREENSHOT
              ? await createPresignedDownload(fileMeta.publicId, 300)
              : r.screenshotUrl;
          return {
            submissionId: r._id?.toString(),
            userId: r.userId,
            teamName: teamByUser.get(r.userId) || nameByUser.get(r.userId),
            status: r.status as ResultStatus,
            screenshotUrl,
            submittedAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
            placement: r.placement,
            kills: r.kills,
            totalScore: r.totalScore,
          };
        })
      );
    } catch {
      submissions = [];
      registeredUsers = [];
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-6 text-[var(--text-primary)]">
      <MatchHeader match={clientMatch} />
      <MatchDetailsCard match={clientMatch} />
      {isAdmin ? (
        <>
          <RegisteredUsersAdminTable users={registeredUsers} />
          <ResultSubmissionsAdminTable submissions={submissions} matchId={match.matchId} />
        </>
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
