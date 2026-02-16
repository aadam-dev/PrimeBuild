import { requireSession } from "@/lib/auth-server";
import { AccountNav } from "@/components/account/AccountNav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Dashboard
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Project Dashboard
          </h1>
          <p className="mt-1 text-slate-500">
            Manage your quotes, orders, and site deliveries.
          </p>
        </div>
        <AccountNav />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
