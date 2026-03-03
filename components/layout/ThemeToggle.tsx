"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import clsx from "clsx";

const STORAGE_KEY = "sa_theme";
type Theme = "dark" | "light";
type ThemePreference = Theme | "system";

const resolveSystemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const nextPreference: ThemePreference =
      saved === "light" || saved === "dark" ? saved : "system";
    const nextTheme = nextPreference === "system" ? resolveSystemTheme() : nextPreference;
    document.documentElement.setAttribute("data-theme", nextTheme);
    queueMicrotask(() => {
      setPreference(nextPreference);
      setTheme(nextTheme);
      setMounted(true);
    });

    if (nextPreference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      const updated = event.matches ? "dark" : "light";
      setTheme(updated);
      document.documentElement.setAttribute("data-theme", updated);
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--toggle-border)] bg-[var(--card-bg)]/85 shadow-[0_0_18px_rgba(49,255,225,0.13)]"
        aria-hidden="true"
      />
    );
  }

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setPreference(next);
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--toggle-border)] bg-[var(--card-bg)]/85 text-[var(--text-primary)] shadow-[0_0_18px_rgba(49,255,225,0.13)] transition hover:border-[var(--accent-primary)]"
      aria-label="Toggle theme"
      title={preference === "system" ? `Theme: system (${theme})` : `Theme: ${preference}`}
    >
      <Icon className={clsx("h-4 w-4", theme === "dark" ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]")} />
    </button>
  );
};

export default ThemeToggle;
