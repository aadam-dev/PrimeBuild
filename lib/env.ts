/**
 * Production env validation. Call at app bootstrap or first use of auth/db.
 * In production, missing required vars throw so the app fails fast.
 */

const isProduction = process.env.NODE_ENV === "production";
const isBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NEXT_PHASE === "phase-production-server";

const requiredInProduction = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
] as const;

let validated = false;

/** Call once at runtime (e.g. first getSession). In production, throws if required env is missing. Skipped during Next.js build. */
export function validateEnv(): void {
  if (!isProduction || isBuildPhase) return;
  if (validated) return;
  validated = true;
  const missing: string[] = [];
  for (const key of requiredInProduction) {
    const value = process.env[key];
    if (value === undefined || value.trim() === "") missing.push(key);
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missing.join(", ")}. ` +
        "Set them in your hosting provider or .env.production."
    );
  }
}

/** Whether the app has minimum config to run (auth + db). */
export function isAppConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL?.trim() &&
      process.env.BETTER_AUTH_SECRET?.trim()
  );
}
