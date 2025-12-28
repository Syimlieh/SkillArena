"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { hostApplicationSchema } from "@/modules/host/host.validator";
import { Button } from "@/components/ui/Button";

export const HostApplicationForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({ displayName: "", description: "", contactEmail: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(undefined);
    setSuccess(false);

    console.log("Submitting form data:", form);
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
      setForm({ displayName: "", description: "", contactEmail: "" });
      router.refresh();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-4 py-3 text-sm text-white focus:border-[var(--primary)] focus:outline-none placeholder:text-slate-500";

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 text-white space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Become a Host</h1>
        <p className="text-sm text-slate-400">Apply to host skill-based matches. Admins will review your request.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-200">Display Name</label>
        <input
          value={form.displayName}
          onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
          className={inputBase}
          placeholder="Team Captain"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-200">Why do you want to host?</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className={`${inputBase} min-h-[120px]`}
          placeholder="Share how you'll run fair and fun lobbies..."
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-200">Contact Email</label>
        <input
          type="email"
          value={form.contactEmail}
          onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
          className={inputBase}
          placeholder="you@example.com"
          required
        />
      </div>
      {message && <p className={success ? "text-sm text-[var(--primary)]" : "text-sm text-red-400"}>{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
};

export default HostApplicationForm;
