import { requireUser } from "@/lib/auth.server";
import { getMatchHistory } from "@/modules/dashboard/dashboard.service";
import { MatchHistory } from "@/components/dashboard/MatchHistory";

const MatchHistoryPage = async () => {
  await requireUser();
  const scrims = await getMatchHistory();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Match History</h1>
        <p className="text-sm text-[var(--text-secondary)]">Your completed matches and results</p>
      </div>
      {scrims.length > 0 ? (
        <MatchHistory scrims={scrims} />
      ) : (
        <div className="glass-panel rounded-2xl p-6 text-sm text-[var(--text-secondary)]">
          No match history yet. Play your first match!
        </div>
      )}
    </div>
  );
};

export default MatchHistoryPage;
