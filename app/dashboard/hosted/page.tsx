import { requireUser } from "@/lib/auth.server";
import { getHostedMatches } from "@/modules/dashboard/dashboard.service";
import { HostedMatchesTable } from "@/components/dashboard/HostedMatchesTable";

const HostedMatchesPage = async () => {
  const user = await requireUser();
  const matches = await getHostedMatches(user.userId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Hosted Matches</h1>
        <p className="text-sm text-[var(--text-secondary)]">Matches you have created and hosted</p>
      </div>
      {matches.length > 0 ? (
        <HostedMatchesTable matches={matches} />
      ) : (
        <div className="glass-panel rounded-2xl p-6 text-sm text-[var(--text-secondary)]">
          You haven&apos;t hosted any matches yet.
        </div>
      )}
    </div>
  );
};

export default HostedMatchesPage;
