"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { ResultStatus } from "@/enums/ResultStatus.enum";
import { ResultSubmissionResponse } from "@/types/result";
import apiClient from "@/lib/apiClient";
import { uploadImageDirect } from "@/lib/presigned-upload";
import { FileType } from "@/types/file.types";

interface Props {
  matchId: string;
  matchStatus: MatchStatus;
  isRegistered?: boolean;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE = 5 * 1024 * 1024;

export const ResultSubmissionCard = ({ matchId, matchStatus, isRegistered }: Props) => {
  const [existing, setExisting] = useState<ResultSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(
    () => matchStatus === MatchStatus.ONGOING || matchStatus === MatchStatus.AWAITING_RESULTS,
    [matchStatus]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/matches/${matchId}/my-result`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 401) {
            setError("Log in to view submission status.");
          }
          setLoading(false);
          return;
        }
        const data = await res.json();
        const submission = data?.data?.submission as ResultSubmissionResponse | undefined;
        if (submission) {
          setExisting(submission);
          setPreviewUrl(submission.screenshotUrl);
        }
      } catch {
        setError("Unable to load submission status.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [matchId]);

  useEffect(
    () => () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl]
  );

  const validateFile = (candidate: File) => {
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      throw new Error("Only JPG or PNG images are allowed.");
    }
    if (candidate.size > MAX_SIZE) {
      throw new Error("Image must be 5MB or smaller.");
    }
  };

  const handleFileChange = (selected?: File | null) => {
    if (!selected) return;
    try {
      validateFile(selected);
      setFile(selected);
      setError(null);
      const nextUrl = URL.createObjectURL(selected);
      setPreviewUrl(nextUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid file.");
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please choose a screenshot to upload.");
      return;
    }
    if (!confirm) {
      setError("Please confirm the screenshot is genuine.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const uploaded = await uploadImageDirect(file, { type: FileType.RESULT_SCREENSHOT, folder: "results" });

      const submitRes = await apiClient.post(`/api/matches/${matchId}/submit-result`, {
        fileId: uploaded.fileId,
      });
      const submission: ResultSubmissionResponse | undefined = submitRes.data?.data?.submission;
      if (submission) {
        setExisting(submission);
        setPreviewUrl(submission.screenshotUrl);
        setFile(null);
        setConfirm(false);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        (err?.response?.status === 401 ? "Log in to submit results." : "Unable to submit result. Please try again.");
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderBody = () => {
    if (loading) return <p className="text-sm text-[var(--text-secondary)]">Loading submission status...</p>;
    if (!isRegistered) {
      return <p className="text-sm text-[var(--text-secondary)]">Register for this match to submit results.</p>;
    }
    if (!canSubmit && !existing)
      return <p className="text-sm text-[var(--text-secondary)]">Result submission opens once the match starts.</p>;
    if (existing) {
      const isRejected = existing.status === ResultStatus.REJECTED || existing.hostRejected;
      const canResubmit = isRejected && canSubmit;
      const statusTone =
        existing.status === ResultStatus.REJECTED
          ? "bg-rose-500/15 text-rose-700 dark:text-rose-200"
          : existing.status === ResultStatus.VERIFIED
            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
            : "bg-amber-500/15 text-amber-700 dark:text-amber-200";
      const statusLabel =
        existing.status === ResultStatus.REJECTED
          ? "Rejected"
          : existing.status === ResultStatus.VERIFIED
            ? "Verified"
            : existing.status === ResultStatus.UNDER_REVIEW
              ? "Under Review"
              : "Pending Verification";
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", statusTone)}>
              {statusLabel}
            </span>
            <span className="text-sm">Screenshot submitted</span>
          </div>
          {(existing.adminRejectReason || existing.hostRejectReason) && (
            <p className="text-xs text-rose-300">
              {existing.adminRejectReason || existing.hostRejectReason}
            </p>
          )}
          {existing.screenshotUrl && (
            <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)]">
              <img src={existing.screenshotUrl} alt="Submitted screenshot" className="w-full max-h-80 object-cover" />
            </div>
          )}
          <p className="text-xs text-[var(--text-secondary)]">Submitted at: {new Date(existing.submittedAt).toLocaleString()}</p>
          {canResubmit ? (
            <div className="flex flex-col gap-4 pt-2">
              <Button type="button" onClick={() => fileInputRef.current?.click()} className="w-fit">
                Upload New Screenshot
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
              <div
                className={clsx(
                  "rounded-xl border border-dashed p-4 transition",
                  file ? "border-[var(--primary)] bg-[var(--card-bg)]" : "border-[var(--border-subtle)] bg-[var(--card-bg)]/60"
                )}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Screenshot preview" className="w-full max-h-80 rounded-lg object-cover" />
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">PNG or JPG up to 5MB.</p>
                )}
              </div>
              <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={confirm}
                  onChange={(e) => setConfirm(e.target.checked)}
                />
                <span>This screenshot is unedited and genuine.</span>
              </label>
              {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
              <Button type="button" onClick={handleSubmit} disabled={submitting} className="w-fit">
                {submitting ? "Submitting..." : "Resubmit Result"}
              </Button>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <Button type="button" onClick={() => fileInputRef.current?.click()} className="w-fit">
          Upload Result Screenshot
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        <div
          className={clsx(
            "rounded-xl border border-dashed p-4 transition",
            file ? "border-[var(--primary)] bg-[var(--card-bg)]" : "border-[var(--border-subtle)] bg-[var(--card-bg)]/60"
          )}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Screenshot preview" className="w-full max-h-80 rounded-lg object-cover" />
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">PNG or JPG up to 5MB.</p>
          )}
        </div>
        <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            className="mt-1"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
          />
          <span>This screenshot is unedited and genuine.</span>
        </label>
        {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        <Button type="button" onClick={handleSubmit} disabled={submitting} className="w-fit">
          {submitting ? "Submitting..." : "Submit Result"}
        </Button>
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="mb-2 text-lg font-semibold text-[var(--text-primary)]">Result Submission</div>
      {renderBody()}
    </div>
  );
};

export default ResultSubmissionCard;
