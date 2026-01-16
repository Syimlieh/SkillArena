import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth.server";

const LoginPage = async () => {
  const user = await requireUser().catch(() => null);
  console.log('user', user)
  if (user) {
    redirect("/");
  }

  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 text-[var(--text-primary)]">
      <div className="grid w-full items-start gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <Badge tone="success">Skill Arena Access</Badge>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            Log in, lock in, and get your squad ready.
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            New here?{" "}
            <Link href="/auth/register" className="text-[var(--accent-primary)] hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="auth-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--accent-primary)]">Login</div>
              <div className="text-xl font-semibold text-[var(--text-primary)]">Welcome back, contender.</div>
            </div>
            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
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
