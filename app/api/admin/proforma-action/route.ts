import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, isValidUUID } from "@/lib/auth-guards";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { proformas, approvalActions } from "@/lib/db/schema";
import { insertActivity } from "@/lib/db/queries/activity";

export async function POST(req: NextRequest) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const { proformaId, action } = await req.json();

  if (!proformaId || !isValidUUID(proformaId)) {
    return NextResponse.json({ error: "Invalid proforma ID" }, { status: 400 });
  }
  if (!["approved", "declined"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const [existing] = await db.select({ status: proformas.status }).from(proformas).where(eq(proformas.id, proformaId)).limit(1);
  // #region agent log
  fetch('http://127.0.0.1:7247/ingest/e49f78da-e5b0-4baf-adee-c83a384e1c33',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/admin/proforma-action:POST',message:'Proforma status guard',data:{proformaId,action,existingStatus:existing?.status??'not-found'},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
  // #endregion
  if (!existing) {
    return NextResponse.json({ error: "Proforma not found" }, { status: 404 });
  }
  if (existing.status !== "pending") {
    return NextResponse.json({ error: `Cannot ${action} a proforma with status '${existing.status}'` }, { status: 409 });
  }

  await db.update(proformas).set({ status: action, updatedAt: new Date() }).where(eq(proformas.id, proformaId));

  await db.insert(approvalActions).values({
    proformaId,
    action,
    actorName: guard.user.name || "Admin",
    actorEmail: guard.user.email || null,
    comment: `Force ${action} by admin`,
  });

  await insertActivity({
    userId: guard.user.id,
    action: `proforma_${action}`,
    entityType: "proforma",
    entityId: proformaId,
  });

  return NextResponse.json({ ok: true });
}
