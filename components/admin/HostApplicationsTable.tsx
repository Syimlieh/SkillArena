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
  [HostApplicationStatus.PENDING]: "bg-amber-500/15 text-amber-300 border border-amber-500/40",
  [HostApplicationStatus.APPROVED]: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40",
  [HostApplicationStatus.REJECTED]: "bg-rose-500/15 text-rose-300 border border-rose-500/40",
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
      <div className="rounded-2xl border border-[#0f172a] bg-[#0a0f17] p-6 text-slate-200">
        <div className="text-lg font-semibold">No applications</div>
        <p className="text-sm text-slate-400">Host applications will appear here for review.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#0f172a] bg-[#0a0f17]">
      <div className="flex items-center justify-between border-b border-[#0f172a] px-6 py-4">
        <div>
          <div className="text-lg font-bold text-white">Host Applications</div>
          <div className="text-sm text-slate-400">
            Pending: {pendingCount} • Total: {rows.length}
          </div>
        </div>
      </div>
      {error && <div className="px-6 py-3 text-sm text-rose-300">{error}</div>}
      <div className="divide-y divide-[#0f172a]">
        {rows.map((app) => (
          <div key={app.id} className="grid grid-cols-1 gap-3 px-6 py-4 md:grid-cols-[1.2fr,1fr,1fr,auto]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{app.displayName}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[app.status]}`}>
                  {app.status}
                </span>
              </div>
              <div className="text-xs text-slate-400">User: {app.userId}</div>
              <p className="text-sm text-slate-300 line-clamp-2">{app.description}</p>
            </div>
            <div className="text-sm text-slate-200">{app.contactEmail}</div>
            <div className="flex flex-col text-sm text-slate-300">
              <span>Submitted: {formatDate(app.createdAt)}</span>
              <span>Reviewed: {formatDate(app.reviewedAt)}</span>
              {app.adminComment && <span className="text-amber-300">Note: {app.adminComment}</span>}
            </div>
            <div className="flex items-center gap-2">
              {app.status === HostApplicationStatus.PENDING ? (
                <>
                  <Button
                    onClick={() => handleAction(app.id, "approve")}
                    disabled={actionId === app.id}
                    className="min-w-[96px]"
                  >
                    {actionId === app.id ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setRejectModal({ id: app.id, comment: "" })}
                    disabled={actionId === app.id}
                    className="min-w-[96px]"
                  >
                    {actionId === app.id ? "Rejecting..." : "Reject"}
                  </Button>
                </>
              ) : (
                <span className="text-xs text-slate-400">No actions</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={Boolean(rejectModal)} onClose={closeRejectModal} title="Reject application?">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-300">
            Add an optional note for the applicant. This decision can&apos;t be undone.
          </p>
          <textarea
            value={rejectModal?.comment ?? ""}
            onChange={(e) => setRejectModal((prev) => (prev ? { ...prev, comment: e.target.value } : prev))}
            className="min-h-[96px] w-full rounded-xl border border-[#1f2937] bg-[#0f172a] p-3 text-sm text-slate-200 outline-none focus:border-indigo-500"
            placeholder="Optional admin comment (visible to applicant)"
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={closeRejectModal}>
              Cancel
            </Button>
            <Button
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
