import { requireUser } from "@/lib/auth.server";
import { getRegisteredMatches } from "@/modules/dashboard/dashboard.service";
import { RegisteredMatches } from "@/components/dashboard/RegisteredMatches";

const MyMatchesPage = async () => {
  const user = await requireUser();
  const matches = await getRegisteredMatches(user.userId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">My Matches</h1>
        <p className="text-sm text-[var(--text-secondary)]">Matches you are registered for</p>
      </div>
      {matches.length > 0 ? (
        <RegisteredMatches matches={matches} />
      ) : (
        <div className="glass-panel rounded-2xl p-6 text-sm text-[var(--text-secondary)]">
          You haven&apos;t registered for any matches yet.
        </div>
      )}
    </div>
  );
};

export default MyMatchesPage;
