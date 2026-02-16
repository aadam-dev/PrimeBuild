import { requireSession } from "@/lib/auth-server";
import { getProfile } from "@/lib/auth-server";
import { AccountSettingsForm } from "@/components/account/AccountSettingsForm";
import { Settings } from "lucide-react";

export const metadata = { title: "Account Settings | Prime Build" };

export default async function AccountSettingsPage() {
  const session = await requireSession();
  const profile = await getProfile(session.user.id);
  const email = (session.user as { email?: string }).email ?? "";
  const name = (session.user as { name?: string }).name ?? "";
  const fullName = profile?.fullName ?? name;
  const phone = profile?.phone ?? "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <Settings className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">Account settings</h2>
          <p className="text-sm text-slate-500">Update your profile and password.</p>
        </div>
      </div>
      <AccountSettingsForm
        initialFullName={fullName}
        initialPhone={phone}
        initialEmail={email}
      />
    </div>
  );
}
