import { getSession } from "@/lib/auth-server";
import { getProfile } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { getSupplierByUserId } from "@/lib/db/queries/admin";
import Link from "next/link";
import { Package, ArrowLeft, AlertTriangle } from "lucide-react";

export default async function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/supplier");
  const profile = await getProfile(session.user.id);
  if (!profile || profile.role !== "supplier") redirect("/");
  const supplier = await getSupplierByUserId(session.user.id);
  if (!supplier) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="mt-6 text-xl font-bold text-slate-950">
            Account Not Linked
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your account is not linked to a supplier profile. Contact admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
              <Package className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Supplier Hub
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Order Management
          </h1>
          <p className="mt-1 text-slate-500">
            View and manage orders assigned to you.
          </p>
        </div>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-1 -mb-px">
            <Link
              href="/supplier"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-950 border-b-2 border-amber-500"
            >
              My Orders
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Store
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 py-8">{children}</div>
    </div>
  );
}
