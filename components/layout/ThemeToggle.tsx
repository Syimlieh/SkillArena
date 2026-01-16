"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import clsx from "clsx";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") {
      setTheme(current);
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--toggle-border)] bg-[var(--card-bg)]"
        aria-hidden="true"
      />
    );
  }

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--toggle-border)] bg-[var(--card-bg)] text-[var(--text-primary)] transition hover:border-[var(--accent-primary)]"
      aria-label="Toggle theme"
    >
      <Icon className={clsx("h-4 w-4", theme === "dark" ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]")} />
    </button>
  );
};

export default ThemeToggle;
