"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HostApplicationStatus } from "@/enums/HostApplicationStatus.enum";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import apiClient from "@/lib/apiClient";

export interface HostApplicationView {
  id: string;
  userId: string;
  displayName: string;
  description: string;
  contactEmail: string;
  status: HostApplicationStatus;
  adminComment?: string;
  createdAt?: string;
  reviewedAt?: string;
}

const statusStyles: Record<HostApplicationStatus, string> = {
  [HostApplicationStatus.PENDING]: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40",
  [HostApplicationStatus.APPROVED]: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40",
  [HostApplicationStatus.REJECTED]: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40",
};

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date))
    : "—";

const normalizeApplication = (app: any): HostApplicationView => ({
  id: app?._id?.toString?.() ?? app?.id ?? "",
  userId: app?.userId ?? "",
  displayName: app?.displayName ?? "",
  description: app?.description ?? "",
  contactEmail: app?.contactEmail ?? "",
  status: app?.status ?? HostApplicationStatus.PENDING,
  adminComment: app?.adminComment,
  createdAt: app?.createdAt ? new Date(app.createdAt).toISOString() : undefined,
  reviewedAt: app?.reviewedAt ? new Date(app.reviewedAt).toISOString() : undefined,
});

export const HostApplicationsTable = ({ applications }: { applications: HostApplicationView[] }) => {
  const router = useRouter();
  const [rows, setRows] = useState<HostApplicationView[]>(applications);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; comment: string } | null>(null);
  const closeRejectModal = useCallback(() => setRejectModal(null), []);

  const pendingCount = useMemo(() => rows.filter((r) => r.status === HostApplicationStatus.PENDING).length, [rows]);

  const handleAction = async (id: string, action: "approve" | "reject", comment?: string) => {
    setActionId(id);
    setError(null);
    try {
      const { data } = await apiClient.patch(
        `/api/host/applications/${id}/${action}`,
        action === "reject" ? { adminComment: comment } : undefined
      );
      if (data?.success === false) {
        setError(data?.error?.message || data?.error || "Unable to update application.");
        return;
      }
      const application = data?.data?.application ?? data?.application;
      if (!application) {
        setError("Invalid response from server.");
        return;
      }
      const normalized = normalizeApplication(application);
      setRows((prev) => prev.map((row) => (row.id === id ? normalized : row)));
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error. Please try again.";
      setError(message);
    } finally {
      setActionId(null);
    }
  };

  if (!rows.length) {
    return (
    <div className="glass-panel rounded-2xl p-6 text-[var(--text-primary)]">
      <div className="text-lg font-semibold">No applications</div>
      <p className="text-sm text-[var(--text-secondary)]">Host applications will appear here for review.</p>
    </div>
  );
}

return (
    <div className="glass-panel rounded-2xl">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
        <div>
          <div className="text-lg font-bold text-[var(--text-primary)]">Host Applications</div>
          <div className="text-sm text-[var(--text-secondary)]">
            Pending: {pendingCount} • Total: {rows.length}
          </div>
        </div>
      </div>
      {error && <div className="px-6 py-3 text-sm text-rose-500 dark:text-rose-300">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-primary)]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-xs uppercase tracking-wide text-[var(--text-secondary)]">
              <th className="px-6 py-3 font-semibold">Applicant</th>
              <th className="px-6 py-3 font-semibold">Contact</th>
              <th className="px-6 py-3 font-semibold">Submitted</th>
              <th className="px-6 py-3 font-semibold">Reviewed</th>
              <th className="px-6 py-3 font-semibold">Note</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {rows.map((app) => (
              <tr key={app.id} className="align-top">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">{app.displayName || "Unknown"}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">User ID: {app.userId || "—"}</div>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 max-w-xl">{app.description || "—"}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{app.contactEmail || "—"}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{formatDate(app.createdAt)}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{formatDate(app.reviewedAt)}</td>
                <td className="px-6 py-4 text-sm text-amber-700 dark:text-amber-200 max-w-xs">
                  {app.adminComment ? (
                    <span className="line-clamp-2">{app.adminComment}</span>
                  ) : (
                    <span className="text-[var(--text-secondary)]">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {app.status === HostApplicationStatus.PENDING ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(app.id, "approve")}
                        disabled={actionId === app.id}
                        className="min-w-[96px]"
                      >
                        {actionId === app.id ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setRejectModal({ id: app.id, comment: "" })}
                        disabled={actionId === app.id}
                        className="min-w-[96px]"
                      >
                        {actionId === app.id ? "Rejecting..." : "Reject"}
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={Boolean(rejectModal)} onClose={closeRejectModal} title="Reject application?">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Add an optional note for the applicant. This decision can&apos;t be undone.
          </p>
          <textarea
            value={rejectModal?.comment ?? ""}
            onChange={(e) => setRejectModal((prev) => (prev ? { ...prev, comment: e.target.value } : prev))}
            className="min-h-[96px] w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
            placeholder="Optional admin comment (visible to applicant)"
          />
          <div className="flex justify-end gap-3">
            <Button size="sm" variant="ghost" onClick={closeRejectModal}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!rejectModal) return;
                const trimmed = rejectModal.comment.trim();
                handleAction(rejectModal.id, "reject", trimmed ? trimmed : undefined);
                closeRejectModal();
              }}
              disabled={actionId === rejectModal?.id}
            >
              {actionId === rejectModal?.id ? "Rejecting..." : "Reject application"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HostApplicationsTable;
