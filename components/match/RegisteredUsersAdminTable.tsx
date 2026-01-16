"use client";

import { Badge } from "@/components/ui/Badge";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";

interface RegisteredUserRow {
  userId?: string;
  name?: string;
  email?: string;
  teamName?: string;
  status: RegistrationStatus;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
  registeredAt?: string;
}

interface Props {
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

export const RegisteredUsersAdminTable = ({ users }: Props) => {
  if (!users.length) {
    return (
      <div className="glass-panel rounded-2xl p-4 text-sm text-[var(--text-secondary)]">
        No registrations yet for this match.
      </div>
    );
  }

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
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Payment</th>
              <th className="pb-2 pr-4">Reference</th>
              <th className="pb-2 pr-4">Registered</th>
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
                <td className="py-2 pr-4">
                  <Badge tone={toneForStatus(user.status)}>{labelForStatus(user.status)}</Badge>
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">
                  {user.paymentAmount ? `₹${user.paymentAmount}` : "—"}
                  {user.paymentMethod ? ` • ${user.paymentMethod}` : ""}
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">{user.paymentReference ?? "—"}</td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] text-xs">{formatDate(user.registeredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredUsersAdminTable;
