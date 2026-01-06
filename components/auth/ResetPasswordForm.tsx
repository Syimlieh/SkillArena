"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { API_ROUTES } from "@/lib/constants";
import { passwordResetFormSchema } from "@/modules/auth/auth.validator";
import { Button } from "@/components/ui/Button";

type FieldErrors = Record<string, string>;

const inputStyles =
  "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]";

type Props = {
  token?: string;
};

export const ResetPasswordForm = ({ token }: Props) => {
  const [formState, setFormState] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string>();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const setField = (field: keyof typeof formState) => (value: string) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setMessage(undefined);

    const parsed = passwordResetFormSchema.safeParse({ ...formState, token });
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
      const response = await fetch(API_ROUTES.authResetConfirm, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: parsed.data.password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        const errorMessage =
          data?.error?.message ?? data?.error ?? "Unable to reset password right now.";
        setMessage(errorMessage);
        setStatus("idle");
        return;
      }

      setStatus("success");
      setMessage("Password updated. You can now log in with your new password.");
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("idle");
    }
  };

  const helperText = useMemo(() => message, [message]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formState.password}
          onChange={(e) => setField("password")(e.target.value)}
          className={inputStyles}
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />
        {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formState.confirmPassword}
          onChange={(e) => setField("confirmPassword")(e.target.value)}
          className={inputStyles}
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />
        {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
      </div>

      {helperText && (
        <p className={`text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>{helperText}</p>
      )}

      <Button
        type="submit"
        className="w-full justify-center bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)]"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Updating..." : "Reset password"}
      </Button>

      {status === "success" && (
        <p className="text-center text-sm text-[var(--text-secondary)]">
          <Link href="/auth/login" className="text-[var(--accent-primary)] hover:underline">
            Return to login
          </Link>
        </p>
      )}
    </form>
  );
};
