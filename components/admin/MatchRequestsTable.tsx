import { MatchRequestAdmin } from "@/types/match-request.types";
import { Badge } from "@/components/ui/Badge";

interface Props {
  requests: MatchRequestAdmin[];
}

export const MatchRequestsTable = ({ requests }: Props) => (
  <div className="glass-panel rounded-2xl p-4">
    <div className="mb-3 text-sm uppercase text-[var(--primary)]">Match Requests</div>
    {requests.length === 0 ? (
      <div className="text-sm text-[var(--text-secondary)]">No match requests yet.</div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-[var(--text-primary)]">
          <thead className="text-xs uppercase text-[var(--text-secondary)]">
            <tr>
              <th className="pb-2 pr-4">Map</th>
              <th className="pb-2 pr-4">Type</th>
              <th className="pb-2 pr-4">Time</th>
              <th className="pb-2 pr-4">Entry</th>
              <th className="pb-2 pr-4">Requested By</th>
              <th className="pb-2 pr-4">Votes</th>
              <th className="pb-2 pr-4">Voters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {requests.map((request) => (
              <tr key={request.id} className="transition hover:bg-[var(--bg-secondary)]/60">
                <td className="py-2 pr-4">
                  <div className="font-semibold">{request.map}</div>
                  <Badge tone="neutral" className="mt-1 text-[10px]">
                    {request.status}
                  </Badge>
                </td>
                <td className="py-2 pr-4">{request.matchType}</td>
                <td className="py-2 pr-4">{request.preferredTimeRange}</td>
                <td className="py-2 pr-4">{request.entryFeeRange ?? "-"}</td>
                <td className="py-2 pr-4">
                  <div className="font-semibold">{request.requestedByName ?? "Unknown"}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{request.requestedByEmail ?? ""}</div>
                </td>
                <td className="py-2 pr-4">{request.voteCount}</td>
                <td className="py-2 pr-4">
                  <div className="space-y-1">
                    {request.voters.length === 0 ? (
                      <span className="text-xs text-[var(--text-secondary)]">No votes</span>
                    ) : (
                      request.voters.map((voter) => (
                        <div key={`${request.id}-${voter.userId}`} className="text-xs text-[var(--text-secondary)]">
                          {voter.name ?? voter.userId}
                          {voter.email ? ` • ${voter.email}` : ""}
                        </div>
                      ))
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default MatchRequestsTable;
