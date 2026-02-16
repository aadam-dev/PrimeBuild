import { FileText } from "lucide-react";
import { AdminProformasList } from "@/components/admin/AdminProformasList";
import { getAdminProformas } from "@/lib/actions/admin";

export default async function AdminProformasPage() {
  const list = await getAdminProformas();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">Proformas</h2>
          <p className="text-sm text-slate-500">
            All quotes issued on the platform.
          </p>
        </div>
      </div>
      <AdminProformasList initialList={list} />
    </div>
  );
}
