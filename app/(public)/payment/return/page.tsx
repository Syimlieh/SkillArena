import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { connectDb } from "@/lib/db";
import { confirmCashfreeOrder } from "@/modules/payments/cashfree.service";
import { PaymentOrderModel } from "@/models/PaymentOrder.model";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: { order_id?: string; orderId?: string };
};

const PaymentReturnPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const orderId = resolvedSearchParams?.order_id ?? resolvedSearchParams?.orderId;

  let statusLabel = "Processing";
  let statusTone: "success" | "warning" | "neutral" = "warning";
  let matchLink: string | null = null;
  let statusDetail = "We are confirming your payment. This can take a few moments.";

  if (orderId) {
    try {
      await connectDb();
      const confirmed = await confirmCashfreeOrder(orderId);
      const cashfreeStatus = confirmed.cashfreeStatus;
      const order = confirmed.order;

      const orderStatus = String(cashfreeStatus?.order_status || "").toUpperCase();
      if (orderStatus === "PAID" || orderStatus === "SUCCESS") {
        statusLabel = "Payment Successful";
        statusTone = "success";
        statusDetail = "Payment received. Your registration will be confirmed shortly.";
      } else if (orderStatus === "FAILED") {
        statusLabel = "Payment Failed";
        statusTone = "warning";
        statusDetail = "Payment failed. Please try again from the match page.";
      } else if (orderStatus) {
        statusLabel = `Payment ${orderStatus}`;
        statusTone = "warning";
      }

      if (order?.matchId) {
        matchLink = `/matches/${order.matchId.toLowerCase()}`;
      }
    } catch {
      statusLabel = "Payment Status Unavailable";
      statusTone = "neutral";
      statusDetail = "We could not verify the payment status yet. Please refresh in a moment.";
    }
  } else {
    statusLabel = "Missing Order ID";
    statusTone = "warning";
    statusDetail = "We could not find your payment order. Please return to the match page.";
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
        <header className="glass-panel rounded-2xl p-6">
          <Badge tone={statusTone} className="text-[11px]">
            Payment Update
          </Badge>
          <h1 className="mt-4 text-3xl font-black text-[var(--text-primary)] md:text-4xl">
            {statusLabel}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{statusDetail}</p>
        </header>

        <section className="glass-panel rounded-2xl p-6 text-sm text-[var(--text-secondary)]">
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--primary)]">Order ID</div>
              <div className="mt-1 text-[var(--text-primary)]">{orderId ?? "Unavailable"}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              {matchLink ? (
                <Link
                  href={matchLink}
                  className="rounded-full bg-[var(--accent-primary)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-black"
                >
                  Go to match page
                </Link>
              ) : (
                <Link
                  href="/"
                  className="rounded-full border border-[var(--border-subtle)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-primary)]"
                >
                  Back to home
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentReturnPage;
