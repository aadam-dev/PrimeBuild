"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const NOT_CONFIGURED =
  "Sign-in is not available yet. Add a Supabase project (see .env.local.example) to enable auth.";

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED };

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string | null;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || undefined, phone: phone || undefined },
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/login?message=Check your email to confirm your account.");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED };

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED };

  const email = formData.get("email") as string;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password/confirm`,
  });

  if (error) return { error: error.message };

  redirect("/login?message=Check your email for the reset link.");
}
