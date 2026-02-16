import { Truck } from "lucide-react";
import { AdminSuppliersList } from "@/components/admin/AdminSuppliersList";
import { getAdminSuppliers } from "@/lib/actions/admin";

export default async function AdminSuppliersPage() {
  const suppliers = await getAdminSuppliers();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
          <Truck className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">Suppliers</h2>
          <p className="text-sm text-slate-500">
            Manage suppliers. Assign them to orders from the Orders page.
          </p>
        </div>
      </div>
      <AdminSuppliersList initialSuppliers={suppliers} />
    </div>
  );
}
