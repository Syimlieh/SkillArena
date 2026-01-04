"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ResultStatus } from "@/enums/ResultStatus.enum";
import { ResultSubmissionResponse } from "@/types/result";
import clsx from "clsx";
import { useState } from "react";

interface SubmissionRow extends ResultSubmissionResponse {
  userId?: string;
  submissionId?: string;
  teamName?: string;
}

interface Props {
  submissions: SubmissionRow[];
  matchId: string;
}

const toneForStatus = (status: ResultStatus) => {
  if (status === ResultStatus.VERIFIED) return "success" as const;
  if (status === ResultStatus.REJECTED) return "warning" as const;
  if (status === ResultStatus.UNDER_REVIEW) return "warning" as const;
  return "neutral" as const;
};

const labelForStatus = (status: ResultStatus) => {
  if (status === ResultStatus.VERIFIED) return "Verified";
  if (status === ResultStatus.REJECTED) return "Rejected";
  if (status === ResultStatus.UNDER_REVIEW) return "Under Review";
  return "Pending";
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));

export const ResultSubmissionsAdminTable = ({ submissions, matchId }: Props) => {
  const [rows, setRows] = useState(submissions);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [matchClosed, setMatchClosed] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleSave = async (row: SubmissionRow, nextStatus: ResultStatus) => {
    if (!row.submissionId) return;
    setSavingId(row.submissionId);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${encodeURIComponent(matchId)}/submissions/${row.submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placement: row.placement ?? null,
          kills: row.kills ?? null,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setError(data?.error?.message || "Unable to update submission.");
        setSavingId(null);
        return;
      }
      const updated = data?.data?.submission as SubmissionRow | undefined;
      if (updated?.submissionId) {
        setRows((prev) => prev.map((r) => (r.submissionId === updated.submissionId ? updated : r)));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const updateField = (id: string, field: "placement" | "kills", value: number | undefined) => {
    setRows((prev) =>
      prev.map((r) => (r.submissionId === id ? { ...r, [field]: value, totalScore: undefined } : r))
    );
  };

  if (!submissions.length) {
    return (
      <div className="glass-panel rounded-2xl p-4 text-sm text-[var(--text-secondary)]">
        No submissions yet for this match.
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="mb-3 text-lg font-semibold text-[var(--text-primary)]">Result Submissions</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-[var(--text-primary)]">
          <thead className="text-xs uppercase text-[var(--text-secondary)]">
            <tr>
              <th className="pb-2 pr-4">User</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Submitted</th>
              <th className="pb-2 pr-4">Placement</th>
              <th className="pb-2 pr-4">Kills</th>
              <th className="pb-2 pr-4">Total</th>
              <th className="pb-2 pr-4">Screenshot</th>
              <th className="pb-2 pr-4 text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {rows.map((submission) => (
              <tr key={submission.submissionId ?? submission.screenshotUrl} className="align-top">
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[var(--text-primary)]">{submission.teamName || "Unnamed Team"}</span>
                    <span className="text-[var(--text-secondary)] text-[11px]">{submission.userId ?? "Unknown user"}</span>
                  </div>
                </td>
                <td className="py-2 pr-4">
                  <Badge tone={toneForStatus(submission.status)}>{labelForStatus(submission.status)}</Badge>
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  {formatDate(submission.submittedAt)}
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2 py-1 text-[var(--text-primary)]"
                    value={submission.placement ?? ""}
                    onChange={(e) =>
                      submission.submissionId &&
                      updateField(submission.submissionId, "placement", e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  <input
                    type="number"
                    min={0}
                    className="w-16 rounded border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2 py-1 text-[var(--text-primary)]"
                    value={submission.kills ?? ""}
                    onChange={(e) =>
                      submission.submissionId &&
                      updateField(submission.submissionId, "kills", e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  {submission.totalScore ?? "-"}
                </td>
                <td className="py-2 pr-4">
                  {submission.screenshotUrl ? (
                    <Link
                      href={submission.screenshotUrl}
                      target="_blank"
                      className="text-xs text-[var(--accent-primary)] hover:underline"
                    >
                      View
                    </Link>
                  ) : (
                    <span className="text-xs text-[var(--text-secondary)]">—</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      disabled={!submission.submissionId || savingId === submission.submissionId}
                      onClick={() => submission.submissionId && handleSave(submission, ResultStatus.VERIFIED)}
                      className={clsx(
                        "rounded-md px-3 py-1 text-xs font-semibold",
                        "border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]",
                        savingId === submission.submissionId && "opacity-60"
                      )}
                    >
                      Approve
                    </button>
                    <button
                      disabled={!submission.submissionId || savingId === submission.submissionId}
                      onClick={() => submission.submissionId && handleSave(submission, ResultStatus.REJECTED)}
                      className={clsx(
                        "rounded-md px-3 py-1 text-xs font-semibold",
                        "border border-[var(--border-subtle)] text-rose-500 hover:border-rose-500",
                        savingId === submission.submissionId && "opacity-60"
                      )}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <div className="flex flex-1 justify-end">
          {rows.length > 0 && rows.every((r) => r.status === ResultStatus.VERIFIED) && (
            <button
              onClick={async () => {
                setClosing(true);
                setError(null);
                try {
                  const res = await fetch(`/api/matches/${encodeURIComponent(matchId)}/close`, { method: "POST" });
                  const data = await res.json();
                  if (!res.ok || data?.success === false) {
                    setError(data?.error?.message || "Unable to close match.");
                  } else {
                    setMatchClosed(true);
                  }
                } catch {
                  setError("Network error while closing match.");
                } finally {
                  setClosing(false);
                }
              }}
              disabled={closing || matchClosed}
              className={clsx(
                "rounded-md px-4 py-2 text-sm font-semibold",
                "bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)]",
                (closing || matchClosed) && "opacity-60"
              )}
            >
              {closing ? "Closing..." : matchClosed ? "Match Closed" : "Close Match & Declare Winner"}
            </button>
          )}
        </div>
      </div>
      {matchClosed && <p className="mt-2 text-sm text-[var(--text-primary)]">Match closed and winner set.</p>}
    </div>
  );
};

export default ResultSubmissionsAdminTable;
