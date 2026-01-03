import Link from "next/link";
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

  const matches = await listMatches(); // pull all statuses for admin view
  const upcoming = matches.filter((m) => m.status === MatchStatus.UPCOMING);
  const ongoing = matches.filter((m) => m.status === MatchStatus.ONGOING);
  // Placeholder: completed matches could be fetched; using static in table per requirements.

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Manage upcoming and previous matches</p>
      </div>
      <UpcomingMatchesTable matches={[...ongoing, ...upcoming]} />
      <PreviousMatchesTable />
      <div className="flex justify-center">
        <Link href="/dashboard/admin/create-match" className="inline-flex">
          <span className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black hover:bg-[#63ff9b]">
            Create New Match
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardShell;
