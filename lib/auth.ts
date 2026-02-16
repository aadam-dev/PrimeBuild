import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendResetPassword } from "@/lib/email";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      void sendResetPassword({ to: user.email, url, user: { name: user.name ?? "" } });
    },
  },
  database: db
    ? drizzleAdapter(db, {
        provider: "pg",
        schema: {
          user: schema.user,
          session: schema.session,
          account: schema.account,
          verification: schema.verification,
        },
        camelCase: true,
      })
    : undefined as any,
  plugins: [nextCookies()],
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ],
  databaseHooks: db
    ? {
        user: {
          create: {
            after: async (user) => {
              const database = db;
              if (!database) return;
              const { profile } = await import("@/lib/db/schema");
              await database
                .insert(profile)
                .values({
                  id: user.id,
                  fullName: user.name ?? undefined,
                  role: "customer",
                })
                .onConflictDoNothing({ target: profile.id });
            },
          },
        },
      }
    : undefined,
});
