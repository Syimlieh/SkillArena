"use client";

import { Button } from "@/components/ui/Button";

interface Props {
  onJoin: () => void;
  disabled?: boolean;
  feedback?: string;
}

const DashboardEmptyState = ({ onJoin, disabled, feedback }: Props) => (
  <div className="glass-panel rounded-2xl p-6 text-white">
    <h2 className="text-2xl font-bold">You haven’t joined any scrims yet</h2>
    <p className="mt-2 text-slate-400">
      Join your first SkillArena scrim to track matches, payouts, and performance.
    </p>
    <div className="mt-4">
      <Button onClick={onJoin} disabled={disabled}>
        {disabled && feedback ? feedback : "Join Your First Scrim"}
      </Button>
    </div>
    {feedback && <p className="mt-2 text-sm text-red-400">{feedback}</p>}
  </div>
);

export default DashboardEmptyState;
