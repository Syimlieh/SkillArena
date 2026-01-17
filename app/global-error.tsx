"use client"

import Link from "next/link";

const GlobalError = ({ error }: { error: Error & { digest?: string } }) => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            We hit an unexpected error. Please try again.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-secondary)]"
          >
            Back to Home
          </Link>
          {error?.digest ? <p className="text-xs text-[var(--text-secondary)]">Ref: {error.digest}</p> : null}
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
