"use client";

import { FormEvent, useMemo, useState } from "react";
import { API_ROUTES } from "@/lib/constants";
import { passwordResetRequestSchema } from "@/modules/auth/auth.validator";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/apiClient";

type FieldErrors = Record<string, string>;

const inputStyles =
  "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>();
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setMessage(undefined);

    const parsed = passwordResetRequestSchema.safeParse({ email });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      const flattened = parsed.error.flatten().fieldErrors;
      Object.entries(flattened).forEach(([key, value]) => {
        if (value?.length) fieldErrors[key] = value.join(", ");
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");
    try {
      const { data } = await apiClient.post(API_ROUTES.authResetRequest, parsed.data);
      if (data?.success === false) {
        const errorMessage = data?.error?.message ?? data?.error ?? "Unable to send reset link right now.";
        setMessage(errorMessage);
        setStatus("idle");
        return;
      }

      setStatus("sent");
      setMessage(data?.data?.message ?? "If that email exists, a reset link is on its way.");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        "Network error. Please try again.";
      setMessage(msg);
      setStatus("idle");
    }
  };

  const helperText = useMemo(() => {
    if (message) return message;
    return undefined;
  }, [message]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputStyles}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
      </div>

      {helperText && (
        <p className={`text-sm ${status === "sent" ? "text-green-400" : "text-red-400"}`}>{helperText}</p>
      )}

      <Button
        type="submit"
        className="w-full justify-center bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)]"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : status === "sent" ? "Link sent" : "Send reset link"}
      </Button>
    </form>
  );
};
