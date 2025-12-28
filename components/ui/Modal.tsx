"use client";

import { ReactNode, useEffect, useRef } from "react";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={clsx(
          "relative z-10 w-full max-w-lg rounded-2xl border border-[#1f2937] bg-[#0c111a] p-6 shadow-2xl outline-none",
          "focus:outline-none focus-visible:outline-none"
        )}
      >
        {title && <div className="mb-3 text-lg font-semibold text-white">{title}</div>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
