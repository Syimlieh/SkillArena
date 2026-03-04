import clsx from "clsx";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const spinnerSizeClass: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export const Spinner = ({ size = "md", className, label = "Loading" }: SpinnerProps) => (
  <span className={clsx("relative inline-flex items-center justify-center", spinnerSizeClass[size], className)} role="status" aria-label={label}>
    <span
      className="absolute inset-0 animate-spin rounded-full border-2"
      style={{
        borderColor: "color-mix(in oklab, currentColor 22%, transparent)",
        borderTopColor: "currentColor",
      }}
    />
    <span
      className="h-[38%] w-[38%] animate-pulse rounded-full"
      style={{ backgroundColor: "currentColor" }}
      aria-hidden="true"
    />
  </span>
);

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: SpinnerSize;
  variant?: "inline" | "panel";
}

export const LoadingState = ({ message = "Loading...", className, size = "md", variant = "inline" }: LoadingStateProps) => (
  <div
    className={clsx(
      variant === "panel"
        ? "glass-panel flex items-center gap-3 rounded-xl p-4"
        : "flex items-center gap-2 text-sm text-[var(--text-secondary)]",
      className
    )}
  >
    <Spinner size={size} className="text-[var(--accent-primary)]" />
    <span className="text-sm text-[var(--text-secondary)]">{message}</span>
  </div>
);

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export const PageLoader = ({ message = "Loading arena...", className }: PageLoaderProps) => (
  <div className={clsx("mx-auto flex min-h-[52vh] w-full max-w-7xl items-center justify-center px-6 py-12 md:px-8", className)}>
    <div className="glass-panel neon-border-flow flex items-center gap-3 rounded-2xl px-5 py-4">
      <Spinner size="lg" className="text-[var(--accent-primary)]" />
      <span className="text-sm font-medium tracking-wide text-[var(--text-secondary)]">{message}</span>
    </div>
  </div>
);
