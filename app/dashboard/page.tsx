import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const DashboardPage = () => (
  <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black text-white">Player Dashboard</h1>
        <p className="text-sm text-slate-400">Track scrims, payments, and squad progress.</p>
      </div>
      <Button>Join New Scrim</Button>
    </div>
    <Card>
      <div className="text-sm uppercase text-[var(--primary)]">Overview</div>
      <div className="mt-2 text-slate-200">Live stats and payments will appear here.</div>
    </Card>
  </div>
);

export default DashboardPage;
