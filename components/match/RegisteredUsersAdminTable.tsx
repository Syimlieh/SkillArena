"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";

interface RegisteredUserRow {
  registrationId?: string;
  userId?: string;
  name?: string;
  email?: string;
  teamName?: string;
  status: RegistrationStatus;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
  registeredAt?: string;
  captainBgmiId?: string;
  captainIgn?: string;
  squadBgmiIds?: string[];
  lockedAt?: string;
}

interface Props {
  matchId: string;
  users: RegisteredUserRow[];
}

const toneForStatus = (status: RegistrationStatus) => {
  if (status === RegistrationStatus.CONFIRMED) return "success" as const;
  if (status === RegistrationStatus.PENDING_PAYMENT) return "warning" as const;
  if (status === RegistrationStatus.CANCELLED) return "neutral" as const;
  return "neutral" as const;
};

const labelForStatus = (status: RegistrationStatus) => {
  if (status === RegistrationStatus.CONFIRMED) return "Confirmed";
  if (status === RegistrationStatus.PENDING_PAYMENT) return "Awaiting Payment";
  if (status === RegistrationStatus.CANCELLED) return "Cancelled";
  return "Pending";
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
};

export const RegisteredUsersAdminTable = ({ matchId, users }: Props) => {
  const router = useRouter();
  const [locking, setLocking] = useState<string | null>(null);
  if (!users.length) {
    return (
      <div className="glass-panel rounded-2xl p-4 text-sm text-[var(--text-secondary)]">
        No registrations yet for this match.
      </div>
    );
  }

  const lockRegistration = async (registrationId?: string) => {
    if (!registrationId) return;
    setLocking(registrationId);
    await fetch(`/api/matches/${matchId}/registrations/${registrationId}/lock`, { method: "POST" });
    setLocking(null);
    router.refresh();
  };

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="mb-3 text-lg font-semibold text-[var(--text-primary)]">Registered Users</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-[var(--text-primary)]">
          <thead className="text-xs uppercase text-[var(--text-secondary)]">
            <tr>
              <th className="pb-2 pr-4">User</th>
              <th className="pb-2 pr-4">Email</th>
              <th className="pb-2 pr-4">Team</th>
              <th className="pb-2 pr-4">BGMI IDs</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Payment</th>
              <th className="pb-2 pr-4">Reference</th>
              <th className="pb-2 pr-4">Registered</th>
              <th className="pb-2 pr-4">Lock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {users.map((user) => (
              <tr key={`${user.userId ?? user.email ?? user.teamName ?? "row"}`}>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[var(--text-primary)]">{user.name ?? "Unknown user"}</span>
                    <span className="text-[var(--text-secondary)] text-[11px]">{user.userId ?? "—"}</span>
                  </div>
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">{user.email ?? "—"}</td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">{user.teamName ?? "—"}</td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  <div className="flex flex-col">
                    <span>Captain: {user.captainBgmiId ?? "—"}</span>
                    {user.captainIgn && <span>IGN: {user.captainIgn}</span>}
                    {user.squadBgmiIds?.length ? (
                      <span>Squad: {user.squadBgmiIds.filter(Boolean).join(", ")}</span>
                    ) : null}
                  </div>
                </td>
                <td className="py-2 pr-4">
                  <Badge tone={toneForStatus(user.status)}>{labelForStatus(user.status)}</Badge>
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  {user.paymentAmount ? `₹${user.paymentAmount}` : "—"}
                  {user.paymentMethod ? ` • ${user.paymentMethod}` : ""}
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">{user.paymentReference ?? "—"}</td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">{formatDate(user.registeredAt)}</td>
                <td className="py-2 pr-4 text-xs">
                  {user.lockedAt ? (
                    <Badge tone="neutral">Locked</Badge>
                  ) : (
                    <button
                      onClick={() => lockRegistration(user.registrationId)}
                      disabled={locking === user.registrationId}
                      className="rounded-lg border border-[var(--border-subtle)] px-2 py-1 text-[10px] font-semibold text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
                    >
                      {locking === user.registrationId ? "Locking..." : "Lock IDs"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredUsersAdminTable;
