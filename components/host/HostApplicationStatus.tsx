"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HostApplicationStatus } from "@/enums/HostApplicationStatus.enum";

interface Props {
  status?: HostApplicationStatus;
  adminComment?: string;
}

const HostApplicationStatus = ({ status, adminComment }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (status === HostApplicationStatus.APPROVED) {
      router.push("/dashboard/host");
    }
  }, [status, router]);

  if (!status) return null;

  if (status === HostApplicationStatus.PENDING) {
    return <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-4 text-sm text-slate-200">Status: Waiting for admin approval.</div>;
  }

  if (status === HostApplicationStatus.REJECTED) {
    return (
      <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-4 text-sm text-red-300">
        Status: Rejected
        {adminComment && <div className="mt-1 text-xs text-slate-300">Note: {adminComment}</div>}
      </div>
    );
  }

  return null;
};

export default HostApplicationStatus;
