import { requireAdmin } from "@/lib/auth.server";
import { listMatches } from "@/modules/matches/match.service";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { UpcomingMatchesTable } from "@/components/admin/UpcomingMatchesTable";

const AdminMatchesPage = async () => {
  await requireAdmin();
  const matches = await listMatches();
  const activeMatches = matches.filter(
    (m) => m.status === MatchStatus.UPCOMING || m.status === MatchStatus.ONGOING
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Matches</h1>
        <p className="text-sm text-[var(--text-secondary)]">Manage upcoming and ongoing matches</p>
      </div>
      <UpcomingMatchesTable matches={activeMatches} />
    </div>
  );
};

export default AdminMatchesPage;
