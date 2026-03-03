import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
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
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 text-[var(--text-primary)] md:px-8">
      <div className="grid w-full items-start gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 self-center">
          <Badge tone="success">Join The Arena</Badge>
          <h1 className="text-4xl font-black leading-tight text-[var(--text-primary)] drop-shadow-[0_0_22px_rgba(49,255,225,0.2)] md:text-5xl">
            Create your esports profile and queue faster.
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            Already registered?{" "}
            <Link href="/auth/login" className="text-[var(--accent-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="auth-card page-reveal p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--accent-primary)]">Signup</div>
              <div className="text-xl font-semibold text-[var(--text-primary)]">Secure your slot.</div>
            </div>
            <span className="rounded-full border border-[var(--panel-border)] bg-[var(--bg-secondary)]/70 px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
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
