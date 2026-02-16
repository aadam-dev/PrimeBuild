"use client";

import { useState, useTransition, useActionState, useEffect } from "react";
import { Search, Download, Shield, ShoppingBag, Truck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateUserRoleAction, linkSupplierToUser, createUserAction, type CreateUserResult } from "@/lib/actions/users";
import { exportToCSV } from "@/lib/utils/export";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
};

type Supplier = { id: string; name: string; userId: string | null };

const ROLE_BADGES: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  admin: { label: "Admin", color: "bg-red-100 text-red-700", icon: Shield },
  customer: { label: "Customer", color: "bg-blue-100 text-blue-700", icon: ShoppingBag },
  supplier: { label: "Supplier", color: "bg-emerald-100 text-emerald-700", icon: Truck },
};

export function UsersClient({ users, suppliers }: { users: User[]; suppliers: Supplier[] }) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [createState, createAction] = useActionState(
    async (_: CreateUserResult | null, formData: FormData) => createUserAction(formData),
    null as CreateUserResult | null
  );
  useEffect(() => {
    if (createState?.ok && createOpen) setCreateOpen(false);
  }, [createState?.ok, createOpen]);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  async function handleRoleChange(userId: string, newRole: string) {
    startTransition(async () => {
      await updateUserRoleAction(userId, newRole);
    });
  }

  async function handleLinkSupplier(supplierId: string, userId: string) {
    startTransition(async () => {
      await linkSupplierToUser(supplierId, userId);
    });
  }

  function handleExport() {
    exportToCSV(
      filtered.map((u) => ({
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Phone: u.phone ?? "",
        "Order Count": u.orderCount,
        "Joined": new Date(u.createdAt).toLocaleDateString(),
      })),
      "users-export"
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
        </select>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-1.5 bg-slate-950 text-white hover:bg-slate-800">
              <UserPlus className="h-3.5 w-3.5" /> Create user
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create new user</DialogTitle>
              <DialogDescription>Add an account with email and password. They can sign in immediately.</DialogDescription>
            </DialogHeader>
            <form action={createAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input id="create-email" name="email" type="email" required placeholder="user@example.com" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <Input id="create-name" name="name" type="text" required placeholder="Full name" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">Password</Label>
                <Input id="create-password" name="password" type="password" required minLength={8} placeholder="Min 8 characters" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Role</Label>
                <select id="create-role" name="role" required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white">
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>
              {createState && !createState.ok && (
                <p className="text-sm text-red-600">{createState.error}</p>
              )}
              {createState?.ok && (
                <p className="text-sm text-emerald-600">User created. They can sign in with the email and password you set.</p>
              )}
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                  Create user
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="sm" onClick={handleExport} className="rounded-xl gap-1.5">
          <Download className="h-3.5 w-3.5" /> CSV
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/80">
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Role</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Orders</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Joined</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filtered.map((u) => {
                const roleBadge = ROLE_BADGES[u.role] ?? ROLE_BADGES.customer;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-950">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={`${roleBadge.color} text-xs`}>{roleBadge.label}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-600">{u.orderCount}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={isPending}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 bg-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="supplier">Supplier</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
