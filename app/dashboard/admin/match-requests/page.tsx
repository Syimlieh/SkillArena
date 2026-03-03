import { requireAdmin } from "@/lib/auth.server";
import { listMatchRequests } from "@/modules/match-requests/match-request.service";
import MatchRequestsTable from "@/components/admin/MatchRequestsTable";
import { MatchRequestAdmin } from "@/types/match-request.types";

const AdminMatchRequestsPage = async () => {
  await requireAdmin();
  const matchRequests = (await listMatchRequests({ includeVoters: true })) as MatchRequestAdmin[];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Match Requests</h1>
        <p className="text-sm text-[var(--text-secondary)]">Community match requests and voter details</p>
      </div>
      <MatchRequestsTable requests={matchRequests} />
    </div>
  );
};

export default AdminMatchRequestsPage;
