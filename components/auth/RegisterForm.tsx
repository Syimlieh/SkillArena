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
import Image from "next/image";

type FieldErrors = Record<string, string>;

const inputStyles =
  "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]";

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
    profileFileId: undefined,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | undefined>();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
      profileFileId: formState.profileFileId,
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

  const handleProfileUpload = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Profile image must be an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Profile image must be under 5MB.");
      return;
    }
    setUploading(true);
    setMessage(undefined);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "profiles");
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setMessage(data?.error?.message || "Unable to upload image.");
        setUploading(false);
        return;
      }
      setField("profileFileId", data?.data?.fileId);
      setPreview(data?.data?.url ?? null);
    } catch {
      setMessage("Network error while uploading profile image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="name">
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
        <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="email">
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
        <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="phone">
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
          <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="password">
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
          <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="confirmPassword">
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

      <label className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-secondary)]">
        <input
          type="checkbox"
          checked={formState.ageVerified}
          onChange={(e) => setField("ageVerified", e.target.checked)}
          className="h-4 w-4 accent-[var(--primary)]"
        />
        <span>I am 18+ and cleared for esports tournaments.</span>
      </label>
      {errors.ageVerified && <p className="text-xs text-red-400">{errors.ageVerified}</p>}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-[var(--text-primary)]">
          <span>Profile Picture (optional)</span>
          {uploading && <span className="text-xs text-[var(--text-secondary)]">Uploading...</span>}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--card-bg)] text-xs text-[var(--text-secondary)] hover:border-[var(--accent-primary)]">
            {preview ? (
              <Image src={preview} alt="Profile preview" width={96} height={96} className="h-full w-full object-cover" />
            ) : (
              <span>{uploading ? "Uploading..." : "Select"}</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleProfileUpload(e.target.files?.[0] ?? null)}
              disabled={uploading}
            />
          </label>
          <div className="text-xs text-[var(--text-secondary)]">
            JPG/PNG, up to 5MB. If not provided, a placeholder is used.
          </div>
        </div>
      </div>

      {helperText && <p className="text-sm text-red-400">{helperText}</p>}

      <Button
        type="submit"
        className="w-full justify-center bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)]"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};
