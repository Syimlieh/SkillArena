import { redirect } from "next/navigation";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { requireUser } from "@/lib/auth.server";
import { listMatches } from "@/modules/matches/match.service";
import { UpcomingMatchesTable } from "@/components/admin/UpcomingMatchesTable";
import { PreviousMatchesTable } from "@/components/admin/PreviousMatchesTable";
import { UserRole } from "@/enums/UserRole.enum";

const AdminDashboardShell = async () => {
  const user = await requireUser();
  if (user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const upcoming = await listMatches(MatchStatus.UPCOMING);
  // Placeholder: completed matches could be fetched; using static in table per requirements.

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-400">Manage upcoming and previous matches</p>
      </div>
      <UpcomingMatchesTable matches={upcoming} />
      <PreviousMatchesTable />
      <div className="flex justify-center">
        <a href="/dashboard/admin/create-match" className="inline-flex">
          <span className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black hover:bg-[#63ff9b]">
            Create New Match
          </span>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboardShell;
