import { requireAdmin } from "@/lib/auth.server";
import { PreviousMatchesTable } from "@/components/admin/PreviousMatchesTable";

const AdminMatchHistoryPage = async () => {
  await requireAdmin();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Match History</h1>
        <p className="text-sm text-[var(--text-secondary)]">Previously completed matches and results</p>
      </div>
      <PreviousMatchesTable />
    </div>
  );
};

export default AdminMatchHistoryPage;
