import { NextResponse } from "next/server";
import { isAppConfigured } from "@/lib/env";
import { sql } from "@/lib/db";

/**
 * GET /api/health — for load balancers and orchestration.
 * Returns 200 when app and DB are OK, 503 when DB is unavailable.
 */
export async function GET() {
  const configured = isAppConfigured();
  if (!configured) {
    return NextResponse.json(
      { ok: false, reason: "config" },
      { status: 503 }
    );
  }
  if (!sql) {
    return NextResponse.json(
      { ok: false, reason: "database" },
      { status: 503 }
    );
  }
  try {
    await sql`SELECT 1`;
  } catch {
    return NextResponse.json(
      { ok: false, reason: "database" },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: true });
}
