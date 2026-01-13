"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  title?: string;
  disableBackdropClose?: boolean;
}

const Modal = ({ isOpen, onClose, children, title, disableBackdropClose = false }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !disableBackdropClose) {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose, disableBackdropClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!disableBackdropClose) onClose?.();
        }}
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "relative z-10 w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-6 shadow-2xl outline-none text-[var(--text-primary)]",
          "max-h-[80vh] overflow-y-auto",
          "focus:outline-none focus-visible:outline-none"
        )}
      >
        {title && <div className="mb-3 text-lg font-semibold text-[var(--text-primary)]">{title}</div>}
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
