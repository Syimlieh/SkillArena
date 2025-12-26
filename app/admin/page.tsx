import { CreateMatchForm } from "@/components/admin/CreateMatchForm";
import { AdminMatchesList } from "@/components/admin/AdminMatchesList";

const AdminPage = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <CreateMatchForm />
      <AdminMatchesList />
    </div>
  );
};

export default AdminPage;
