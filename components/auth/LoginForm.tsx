"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthStatus } from "@/enums/AuthStatus.enum";
import { useAuth } from "@/context/AuthContext";
import { loginSchema } from "@/modules/auth/auth.validator";
import { LoginPayload } from "@/types/auth.types";
import { Button } from "@/components/ui/Button";
import { consumePostLoginRedirect } from "@/lib/auth";
import { AppRoute } from "@/lib/routes";

type FieldErrors = Record<string, string>;

const inputStyles =
  "w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-4 py-3 text-sm text-white focus:border-[var(--primary)] focus:outline-none placeholder:text-slate-500";

export const LoginForm = () => {
  const router = useRouter();
  const { state, login } = useAuth();
  const [formState, setFormState] = useState<LoginPayload>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | undefined>();

  const isLoading = state.status === AuthStatus.LOADING;

  const setField = (field: keyof LoginPayload) => (value: string) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setMessage(undefined);

    const parsed = loginSchema.safeParse(formState);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      const flattened = parsed.error.flatten().fieldErrors;
      Object.entries(flattened).forEach(([key, value]) => {
        if (value?.length) fieldErrors[key] = value.join(", ");
      });
      setErrors(fieldErrors);
      return;
    }

    const result = await login(parsed.data);
    if (!result.success) {
      if (result.fieldErrors) {
        const mapped: FieldErrors = {};
        Object.entries(result.fieldErrors).forEach(([key, value]) => {
          if (value?.length) mapped[key] = value.join(", ");
        });
        setErrors(mapped);
      }
      setMessage(result.message ?? "Unable to login right now.");
      return;
    }

    const redirectTarget = consumePostLoginRedirect() ?? AppRoute.DASHBOARD_MY_MATCHES;
    router.push(redirectTarget);
  };

  const helperText = useMemo(() => {
    if (message) return message;
    if (state.error) return state.error;
    return undefined;
  }, [message, state.error]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-white" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formState.email}
          onChange={(e) => setField("email")(e.target.value)}
          className={inputStyles}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-white" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formState.password}
          onChange={(e) => setField("password")(e.target.value)}
          className={inputStyles}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
      </div>

      {helperText && <p className="text-sm text-red-400">{helperText}</p>}

      <Button
        type="submit"
        className="w-full justify-center bg-[var(--primary)] text-black hover:bg-[#63ff9b]"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Login"}
      </Button>
    </form>
  );
};
