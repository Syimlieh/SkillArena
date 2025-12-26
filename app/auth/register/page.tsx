import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
      <div className="grid w-full items-start gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <Badge tone="success">Join The Arena</Badge>
          <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
            Create your esports profile and queue faster.
          </h1>
          
          <p className="text-sm text-slate-400">
            Already registered?{" "}
            <Link href="/auth/login" className="text-[var(--primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <Card className="border border-[rgba(66,255,135,0.15)] bg-[#0c111a]/90 shadow-[0_10px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--primary)]">Signup</div>
              <div className="text-xl font-semibold text-white">Secure your slot.</div>
            </div>
            <span className="rounded-full bg-[rgba(66,255,135,0.16)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              Neon Ready
            </span>
          </div>
          <RegisterForm />
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
