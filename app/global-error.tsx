"use client";

import { useEffect } from "react";

const GlobalError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error("Global error", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            We hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-secondary)]"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
