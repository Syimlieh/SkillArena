"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthStatus } from "@/enums/AuthStatus.enum";
import { useAuth } from "@/context/AuthContext";
import { registerSchema } from "@/modules/auth/auth.validator";
import { RegisterPayload } from "@/types/auth.types";
import { Button } from "@/components/ui/Button";
import { consumePostLoginRedirect } from "@/lib/auth";
import { AppRoute } from "@/lib/routes";
import { resolveDashboardRoute } from "@/modules/navigation/navigation.service";

type FieldErrors = Record<string, string>;

const inputStyles =
  "w-full rounded-xl border border-[#1f2937] bg-[#0c111a] px-4 py-3 text-sm text-white focus:border-[var(--primary)] focus:outline-none placeholder:text-slate-500";

type RegisterFormState = RegisterPayload & { confirmPassword: string };

export const RegisterForm = () => {
  const router = useRouter();
  const { state, register } = useAuth();
  const [formState, setFormState] = useState<RegisterFormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    ageVerified: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | undefined>();

  const isLoading = state.status === AuthStatus.LOADING;

  const setField = <K extends keyof RegisterFormState>(field: K, value: RegisterFormState[K]) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setMessage(undefined);

    const payload = {
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      password: formState.password,
      ageVerified: formState.ageVerified,
    };

    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      const flattened = parsed.error.flatten().fieldErrors;
      Object.entries(flattened).forEach(([key, value]) => {
        if (value?.length) fieldErrors[key] = value.join(", ");
      });
      setErrors(fieldErrors);
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (!formState.ageVerified) {
      setErrors({ ageVerified: "Please confirm age verification" });
      return;
    }

    const result = await register(parsed.data);
    if (!result.success) {
      if (result.fieldErrors) {
        const mapped: FieldErrors = {};
        Object.entries(result.fieldErrors).forEach(([key, value]) => {
          if (value?.length) mapped[key] = value.join(", ");
        });
        setErrors((prev) => ({ ...prev, ...mapped }));
      }
      setMessage(result.message ?? "Unable to register right now.");
      return;
    }

    const redirectTarget =
      consumePostLoginRedirect() ?? resolveDashboardRoute(result.user?.role ?? state.user?.role);
    router.push(redirectTarget || AppRoute.DASHBOARD_MY_MATCHES);
  };

  const helperText = useMemo(() => {
    if (message) return message;
    if (state.error) return state.error;
    return undefined;
  }, [message, state.error]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-white" htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formState.name}
          onChange={(e) => setField("name", e.target.value)}
          className={inputStyles}
          placeholder="Squad leader name"
          autoComplete="name"
          required
        />
        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-white" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formState.email}
          onChange={(e) => setField("email", e.target.value)}
          className={inputStyles}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-white" htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formState.phone}
          onChange={(e) => setField("phone", e.target.value)}
          className={inputStyles}
          placeholder="+91 9876543210"
          autoComplete="tel"
          required
        />
        {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-white" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formState.password}
            onChange={(e) => setField("password", e.target.value)}
            className={inputStyles}
            placeholder="Strong password"
            autoComplete="new-password"
            required
          />
          {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-white" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formState.confirmPassword}
            onChange={(e) => setField("confirmPassword", e.target.value)}
            className={inputStyles}
            placeholder="Repeat password"
            autoComplete="new-password"
            required
          />
          {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-[#1f2937] bg-[#0c111a] px-4 py-3 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={formState.ageVerified}
          onChange={(e) => setField("ageVerified", e.target.checked)}
          className="h-4 w-4 accent-[var(--primary)]"
        />
        <span>I am 18+ and cleared for esports tournaments.</span>
      </label>
      {errors.ageVerified && <p className="text-xs text-red-400">{errors.ageVerified}</p>}

      {helperText && <p className="text-sm text-red-400">{helperText}</p>}

      <Button
        type="submit"
        className="w-full justify-center bg-[var(--primary)] text-black hover:bg-[#63ff9b]"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};
