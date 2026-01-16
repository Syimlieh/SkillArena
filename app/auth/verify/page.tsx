import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { VerifyEmailStatus } from "@/components/auth/VerifyEmailStatus";

type VerifyPageProps = {
  searchParams?: Promise<{ token?: string }>;
};

const VerifyEmailPage = async ({ searchParams }: VerifyPageProps) => {
  const { token } = (await searchParams) ?? {};

  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 text-[var(--text-primary)]">
        <div className="grid w-full items-start gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <Badge tone="success">Email Verification</Badge>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Verify your email to unlock match registrations.
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Didn&apos;t receive it? You can resend from your profile settings.
            </p>
          </div>

          <div className="auth-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-[var(--accent-primary)]">Verify</div>
                <div className="text-xl font-semibold text-[var(--text-primary)]">Confirm your email.</div>
              </div>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                Secure Link
              </span>
            </div>
            {token ? (
              <VerifyEmailStatus token={token} />
            ) : (
              <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                <p>We couldn&apos;t find a verification token. Try opening the link from your email.</p>
                <Link href="/auth/login" className="text-[var(--accent-primary)] hover:underline">
                  Back to login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailPage;
