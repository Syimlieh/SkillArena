import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth.server";
import { resolveDashboardRoute } from "@/modules/navigation/navigation.service";

const ForgotPasswordPage = async () => {
  const user = await requireUser().catch(() => null);
  if (user) {
    redirect(resolveDashboardRoute(user.role));
  }

  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 text-[var(--text-primary)]">
        <div className="grid w-full items-start gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <Badge tone="success">Reset Access</Badge>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Forgot your password? We&apos;ll send you a reset link.
            </h1>

            <p className="text-sm text-[var(--text-secondary)]">
              Remembered it?{" "}
              <Link href="/auth/login" className="text-[var(--accent-primary)] hover:underline">
                Back to login
              </Link>
            </p>
          </div>

          <div className="auth-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-[var(--accent-primary)]">Reset</div>
                <div className="text-xl font-semibold text-[var(--text-primary)]">Send reset link.</div>
              </div>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                Secure Mode
              </span>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
