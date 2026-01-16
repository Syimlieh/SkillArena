"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "sa_sidebar_collapsed";

export const useSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored !== null) {
      setIsCollapsed(stored === "1");
    }
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      }
      return next;
    });
  };

  return {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    setIsMobileOpen,
  };
};
