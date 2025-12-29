import { HostApplicationsTable } from "@/components/admin/HostApplicationsTable";
import { requireAdmin } from "@/lib/auth.server";
import { listHostApplications } from "@/modules/host/host.service";

const serializeApplication = (app: any) => ({
  id: app._id?.toString?.() ?? "",
  userId: app.userId,
  displayName: app.displayName,
  description: app.description,
  contactEmail: app.contactEmail,
  status: app.status,
  adminComment: app.adminComment,
  createdAt: app.createdAt ? new Date(app.createdAt).toISOString() : undefined,
  reviewedAt: app.reviewedAt ? new Date(app.reviewedAt).toISOString() : undefined,
});

const HostApplicationsPage = async () => {
  await requireAdmin();
  const apps = await listHostApplications();
  const serialized = apps.map(serializeApplication);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-black text-white">Host Applications</h1>
        <p className="text-sm text-slate-400">Review and approve player requests to become hosts.</p>
      </div>
      <HostApplicationsTable applications={serialized} />
    </div>
  );
};

export default HostApplicationsPage;
