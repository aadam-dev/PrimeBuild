"use client";

import { useState } from "react";
import { useActionState } from "react";
import { authClient } from "@/lib/auth-client";
import { updateProfileAction, type UpdateProfileResult } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  initialFullName: string;
  initialPhone: string;
  initialEmail: string;
};

export function AccountSettingsForm({
  initialFullName,
  initialPhone,
  initialEmail,
}: Props) {
  const [profileState, formAction] = useActionState(
    async (_: UpdateProfileResult | null, formData: FormData) => updateProfileAction(formData),
    null as UpdateProfileResult | null
  );
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const currentPassword = (form.querySelector('[name="currentPassword"]') as HTMLInputElement)?.value;
    const newPassword = (form.querySelector('[name="newPassword"]') as HTMLInputElement)?.value;
    if (!currentPassword || !newPassword) {
      setPasswordMessage({ type: "error", text: "Please fill in both fields." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    setPasswordLoading(true);
    setPasswordMessage(null);
    const { data, error } = await authClient.changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: false,
    });
    setPasswordLoading(false);
    if (error) {
      setPasswordMessage({ type: "error", text: error.message ?? "Failed to change password." });
      return;
    }
    setPasswordMessage({ type: "success", text: "Password updated successfully." });
    form.reset();
  }

  return (
    <div className="space-y-10">
      {/* Profile */}
      <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Update your name and phone number.</p>
        <form action={formAction} className="mt-6 max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">Email</Label>
            <Input
              id="email"
              type="email"
              value={initialEmail}
              disabled
              className="h-11 rounded-xl border-slate-200 bg-slate-50"
            />
            <p className="text-xs text-slate-400">Email cannot be changed here.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-700">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              defaultValue={initialFullName}
              placeholder="Your name"
              className="h-11 rounded-xl border-slate-200"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={initialPhone ?? ""}
              placeholder="+233 ..."
              className="h-11 rounded-xl border-slate-200"
              autoComplete="tel"
            />
          </div>
          {profileState && !profileState.ok && (
            <p className="text-sm text-red-600">{profileState.error}</p>
          )}
          {profileState?.ok && (
            <p className="text-sm text-emerald-600">Profile updated.</p>
          )}
          <Button type="submit" className="h-11 rounded-xl bg-slate-950 text-white hover:bg-slate-800">
            Save profile
          </Button>
        </form>
      </section>

      {/* Change password */}
      <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Change password</h2>
        <p className="mt-1 text-sm text-slate-500">Set a new password for your account.</p>
        <form onSubmit={handleChangePassword} className="mt-6 max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-slate-700">Current password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="h-11 rounded-xl border-slate-200"
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-slate-700">New password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="h-11 rounded-xl border-slate-200"
              autoComplete="new-password"
            />
            <p className="text-xs text-slate-400">At least 8 characters.</p>
          </div>
          {passwordMessage && (
            <p className={passwordMessage.type === "error" ? "text-sm text-red-600" : "text-sm text-emerald-600"}>
              {passwordMessage.text}
            </p>
          )}
          <Button type="submit" disabled={passwordLoading} className="h-11 rounded-xl bg-slate-950 text-white hover:bg-slate-800">
            {passwordLoading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </section>
    </div>
  );
}
