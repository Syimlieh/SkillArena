import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

type ResetPageProps = {
   searchParams?: Promise<{ token?: string }>;
};

const ResetPasswordPage = async ({ searchParams }: ResetPageProps) => {
  const { token } = (await searchParams) ?? {};
  
  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 text-[var(--text-primary)]">
        <div className="grid w-full items-start gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <Badge tone="success">Reset Access</Badge>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Choose a fresh password and get back in the arena.
            </h1>

            <p className="text-sm text-[var(--text-secondary)]">
              Need a new link?{" "}
              <Link href="/auth/forgot" className="text-[var(--accent-primary)] hover:underline">
                Request another reset
              </Link>
            </p>
          </div>

          <div className="auth-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-[var(--accent-primary)]">Reset</div>
                <div className="text-xl font-semibold text-[var(--text-primary)]">Set a new password.</div>
              </div>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                Secure Mode
              </span>
            </div>
            {token ? (
              <ResetPasswordForm token={token} />
            ) : (
              <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                <p>We couldn&apos;t find a reset token. Try reopening the link from your email.</p>
                <Link href="/auth/forgot" className="text-[var(--accent-primary)] hover:underline">
                  Request a new reset link
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
