import { requireUser } from "@/lib/auth.server";
import { getAvailableMatches } from "@/modules/dashboard/dashboard.service";
import { AvailableMatches } from "@/components/dashboard/AvailableMatches";

const AvailableMatchesPage = async () => {
  const user = await requireUser();
  const matches = await getAvailableMatches(user.userId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Available Matches</h1>
        <p className="text-sm text-[var(--text-secondary)]">Upcoming matches you can join</p>
      </div>
      {matches.length > 0 ? (
        <AvailableMatches matches={matches} />
      ) : (
        <div className="glass-panel rounded-2xl p-6 text-sm text-[var(--text-secondary)]">
          No matches available right now. Check back soon!
        </div>
      )}
    </div>
  );
};

export default AvailableMatchesPage;
