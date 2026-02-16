import { Users } from "lucide-react";
import { getAdminUsers, getAllSuppliersForLinking } from "@/lib/actions/users";
import { UsersClient } from "./UsersClient";

export const metadata = { title: "Users | Admin" };

export default async function AdminUsersPage() {
  const [users, suppliers] = await Promise.all([
    getAdminUsers(),
    getAllSuppliersForLinking(),
  ]);

  const data = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role ?? "customer",
    phone: u.phone,
    createdAt: u.createdAt.toISOString(),
    orderCount: u.orderCount,
  }));

  const supps = suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    userId: s.userId,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
          <Users className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">User Management</h2>
          <p className="text-sm text-slate-500">{users.length} registered accounts</p>
        </div>
      </div>

      <UsersClient users={data} suppliers={supps} />
    </div>
  );
}
