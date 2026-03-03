import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { LoginForm } from "@/components/auth/LoginForm";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth.server";

const LoginPage = async () => {
  const user = await requireUser().catch(() => null);
  if (user) {
    redirect("/");
  }

  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 text-[var(--text-primary)] md:px-8">
      <div className="grid w-full items-start gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 self-center">
          <Badge tone="success">Skill Arena Access</Badge>
          <h1 className="text-4xl font-black leading-tight text-[var(--text-primary)] drop-shadow-[0_0_22px_rgba(49,255,225,0.2)] md:text-5xl">
            Log in, lock in, and get your squad ready.
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            New here?{" "}
            <Link href="/auth/register" className="text-[var(--accent-primary)] hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="auth-card page-reveal p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--accent-primary)]">Login</div>
              <div className="text-xl font-semibold text-[var(--text-primary)]">Welcome back, contender.</div>
            </div>
            <span className="rounded-full border border-[var(--panel-border)] bg-[var(--bg-secondary)]/70 px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
              Secure Mode
            </span>
          </div>
          <LoginForm />
        </div>
      </div>
      </div>
    </>
  );
};

export default LoginPage;
