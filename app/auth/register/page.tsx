import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth.server";

const RegisterPage = async () => {
  const user = await requireUser().catch(() => null);
  if (user) {
    redirect("/");
  }

  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 text-[var(--text-primary)]">
      <div className="grid w-full items-start gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <Badge tone="success">Join The Arena</Badge>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            Create your esports profile and queue faster.
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            Already registered?{" "}
            <Link href="/auth/login" className="text-[var(--accent-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="auth-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--accent-primary)]">Signup</div>
              <div className="text-xl font-semibold text-[var(--text-primary)]">Secure your slot.</div>
            </div>
            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
              Neon Ready
            </span>
          </div>
          <RegisterForm />
        </div>
      </div>
      </div>
    </>
  );
};

export default RegisterPage;
