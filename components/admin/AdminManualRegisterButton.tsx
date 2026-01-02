"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SafeUser } from "@/types/user.types";

interface Props {
  matchId: string;
  buttonVariant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

const AdminManualRegisterButton = ({ matchId, buttonVariant = "secondary", fullWidth = false }: Props) => {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SafeUser[]>([]);
  const [selected, setSelected] = useState<SafeUser | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const show = isAdmin;

  useEffect(() => {
    if (!show) return;
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
    }
  }, [show, isAuthenticated, router, pathname]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && data?.data?.users) {
          setResults(data.data.users);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 200);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, open]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const closeModal = useCallback(() => setOpen(false), []);

  const handleSubmit = async () => {
    if (!selected) {
      setError("Select a user to register.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/matches/${matchId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selected._id?.toString?.() ?? selected._id ?? selected.email,
          paymentReference: paymentReference || undefined,
          paymentAmount: paymentAmount ? Number(paymentAmount) : undefined,
          paymentMethod: paymentMethod || undefined,
          paymentNote: paymentNote || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        setError(data?.error?.message || data?.error || "Unable to register user");
        return;
      }
      closeModal();
      setSelected(null);
      setPaymentReference("");
      setPaymentAmount("");
      setPaymentMethod("");
      setPaymentNote("");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const userLabel = (u: SafeUser) => `${u.name} • ${u.email} • ${u.phone}`;

  if (!show) return null;

  return (
    <div className={clsx("space-y-2", fullWidth && "w-full")}>
      <Button variant={buttonVariant} onClick={() => setOpen(true)} className={clsx(fullWidth && "w-full justify-center")}>
        Register User
      </Button>
      <Modal isOpen={open} onClose={closeModal} title="Register user for match">
        <div className="flex flex-col gap-3">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Find user</label>
            <div className="relative" ref={searchRef}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setDropdownOpen(true)}
                onClick={() => setDropdownOpen(true)}
                placeholder="Search by name, email, or phone"
                className="w-full rounded-xl border border-[#1f2937] bg-[#0f172a] px-3 py-2 text-sm text-white outline-none focus:border-[var(--primary)]"
              />
              {dropdownOpen && !selected && (
                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-[#1f2937] bg-[#0c111a] shadow-lg">
                  {loadingSearch && <div className="px-3 py-2 text-xs text-slate-400">Searching...</div>}
                  {!loadingSearch &&
                    results.map((u) => (
                      <button
                        key={(u as any)._id?.toString?.() ?? u.email}
                        onClick={() => {
                          setSelected(u);
                          setDropdownOpen(false);
                        }}
                        className="flex w-full flex-col items-start px-3 py-2 text-left text-xs text-slate-200 hover:bg-[#111827]"
                      >
                        <span className="font-semibold">{u.name}</span>
                        <span className="text-slate-400">{u.email}</span>
                        <span className="text-slate-500">{u.phone}</span>
                      </button>
                    ))}
                  {!loadingSearch && results.length === 0 && (
                    <div className="px-3 py-2 text-xs text-slate-500">No users found</div>
                  )}
                </div>
              )}
            </div>
            {selected && (
              <div className="flex items-center justify-between rounded-xl bg-[#0f172a] px-3 py-2 text-xs text-slate-200">
                <span>{userLabel(selected)}</span>
                <button
                  className="text-[var(--primary)]"
                  onClick={() => {
                    setSelected(null);
                    setDropdownOpen(true);
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Payment reference
              <input
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#1f2937] bg-[#0f172a] px-3 py-2 text-sm text-white outline-none focus:border-[var(--primary)]"
                placeholder="Txn / receipt number"
              />
            </label>
            <label className="text-sm text-slate-300">
              Payment amount
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#1f2937] bg-[#0f172a] px-3 py-2 text-sm text-white outline-none focus:border-[var(--primary)]"
                placeholder="₹"
                min={0}
              />
            </label>
          </div>
          <label className="text-sm text-slate-300">
            Payment method
            <input
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#1f2937] bg-[#0f172a] px-3 py-2 text-sm text-white outline-none focus:border-[var(--primary)]"
              placeholder="UPI / Cash"
            />
          </label>
          <label className="text-sm text-slate-300">
            Payment note
            <textarea
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#1f2937] bg-[#0f172a] px-3 py-2 text-sm text-white outline-none focus:border-[var(--primary)]"
              rows={3}
              placeholder="Any additional details"
            />
          </label>

          {error && <div className="text-sm text-rose-300">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Registering..." : "Register User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminManualRegisterButton;
