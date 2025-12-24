import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const AdminPage = () => (
  <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black text-white">Admin Control</h1>
        <p className="text-sm text-slate-400">Manage scrims, payouts, and lobbies.</p>
      </div>
      <Badge tone="success">Role: ADMIN</Badge>
    </div>
    <Card>
      <div className="text-sm uppercase text-[var(--primary)]">Security</div>
      <div className="mt-2 text-slate-200">Admin APIs are role-gated and webhook signatures are verified.</div>
    </Card>
  </div>
);

export default AdminPage;
