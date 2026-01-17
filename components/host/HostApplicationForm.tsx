"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { hostApplicationSchema } from "@/modules/host/host.validator";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export const HostApplicationForm = () => {
  const router = useRouter();
  const { state } = useAuth();
  const [form, setForm] = useState({
    displayName: "",
    description: "",
    contactEmail: "",
    hasHostedBefore: false,
    understandsRules: false,
    agreesFairPlay: false,
    understandsBan: false,
    agreesCoordinate: false,
    confirmsPayouts: false,
    confirmsMobile: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  const allConfirmed = useMemo(
    () =>
      form.hasHostedBefore &&
      form.understandsRules &&
      form.agreesFairPlay &&
      form.understandsBan &&
      form.agreesCoordinate &&
      form.confirmsPayouts &&
      form.confirmsMobile,
    [form]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(undefined);
    setSuccess(false);

    const parsed = hostApplicationSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstError =
        fieldErrors.displayName?.[0] ||
        fieldErrors.description?.[0] ||
        fieldErrors.contactEmail?.[0] ||
        parsed.error.issues[0]?.message ||
        "Please fix validation errors.";
      setMessage(firstError);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/host/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setMessage(data?.error?.message || data?.error || "Unable to submit application.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setMessage("Your host application has been submitted for review.");
      setForm({
        displayName: "",
        description: "",
        contactEmail: "",
        hasHostedBefore: false,
        understandsRules: false,
        agreesFairPlay: false,
        understandsBan: false,
        agreesCoordinate: false,
        confirmsPayouts: false,
        confirmsMobile: false,
      });
      router.refresh();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]";
  const checkboxBase =
    "flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-secondary)]";

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Become a Host</h1>
        <p className="text-sm text-[var(--text-secondary)]">Apply to host skill-based matches. Admins will review your request.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--text-primary)]">Display Name</label>
        <input
          value={form.displayName}
          onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
          className={inputBase}
          placeholder="Team Captain"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--text-primary)]">Why do you want to host?</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className={`${inputBase} min-h-[120px]`}
          placeholder="Share how you'll run fair and fun lobbies..."
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--text-primary)]">Contact Email</label>
        <input
          type="email"
          value={form.contactEmail}
          onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
          className={inputBase}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--text-primary)]">Host Declarations</label>
        <label className={checkboxBase}>
          <input
            type="checkbox"
            checked={form.hasHostedBefore}
            onChange={(e) => setForm((prev) => ({ ...prev, hasHostedBefore: e.target.checked }))}
            className="mt-1 h-4 w-4 accent-[var(--primary)]"
          />
          <span>I have previously hosted BGMI / PUBG / esports scrims or tournaments.</span>
        </label>
        <label className={checkboxBase}>
          <input
            type="checkbox"
            checked={form.understandsRules}
            onChange={(e) => setForm((prev) => ({ ...prev, understandsRules: e.target.checked }))}
            className="mt-1 h-4 w-4 accent-[var(--primary)]"
          />
          <span>I understand SkillArena match rules, scoring systems, and result verification.</span>
        </label>
        <label className={checkboxBase}>
          <input
            type="checkbox"
            checked={form.agreesFairPlay}
            onChange={(e) => setForm((prev) => ({ ...prev, agreesFairPlay: e.target.checked }))}
            className="mt-1 h-4 w-4 accent-[var(--primary)]"
          />
          <span>I agree to run fair lobbies and never favor any team or player.</span>
        </label>
        <label className={checkboxBase}>
          <input
            type="checkbox"
            checked={form.understandsBan}
            onChange={(e) => setForm((prev) => ({ ...prev, understandsBan: e.target.checked }))}
            className="mt-1 h-4 w-4 accent-[var(--primary)]"
          />
          <span>I understand that submitting incorrect or manipulated results can lead to permanent host ban.</span>
        </label>
        <label className={checkboxBase}>
          <input
            type="checkbox"
            checked={form.agreesCoordinate}
            onChange={(e) => setForm((prev) => ({ ...prev, agreesCoordinate: e.target.checked }))}
            className="mt-1 h-4 w-4 accent-[var(--primary)]"
          />
          <span>I agree to coordinate with admins if disputes, no-shows, or issues occur.</span>
        </label>
        <label className={checkboxBase}>
          <input
            type="checkbox"
            checked={form.confirmsPayouts}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmsPayouts: e.target.checked }))}
            className="mt-1 h-4 w-4 accent-[var(--primary)]"
          />
          <span>I confirm that payouts are released only after admin approval.</span>
        </label>
        <label className={checkboxBase}>
          <input
            type="checkbox"
            checked={form.confirmsMobile}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmsMobile: e.target.checked }))}
            className="mt-1 h-4 w-4 accent-[var(--primary)]"
          />
          <span>
            I confirm this is my active mobile number{" "}
            <span className="font-semibold text-[var(--accent-primary)]">
              ({state.user?.phone ?? "not set"})
            </span>{" "}
            and I can be contacted by SkillArena admins.
          </span>
        </label>
      </div>
      {message && <p className={success ? "text-sm text-[var(--primary)]" : "text-sm text-red-400"}>{message}</p>}
      <Button type="submit" disabled={loading || !allConfirmed}>
        {loading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
};

export default HostApplicationForm;
