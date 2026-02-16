import { desc, eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { activityLog, user } from "@/lib/db/schema";

export async function insertActivity(params: {
  userId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}) {
  if (!db) return;
  await db.insert(activityLog).values({
    userId: params.userId ?? null,
    action: params.action,
    entityType: params.entityType ?? null,
    entityId: params.entityId ?? null,
    metadata: params.metadata ?? null,
    ipAddress: params.ipAddress ?? null,
  });
}

export async function getRecentActivity(limit = 20) {
  if (!db) return [];
  const rows = await db
    .select({
      id: activityLog.id,
      action: activityLog.action,
      entityType: activityLog.entityType,
      entityId: activityLog.entityId,
      metadata: activityLog.metadata,
      createdAt: activityLog.createdAt,
      userName: user.name,
    })
    .from(activityLog)
    .leftJoin(user, eq(activityLog.userId, user.id))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit);
  return rows;
}

export async function getActivityByEntity(entityType: string, entityId: string) {
  if (!db) return [];
  return db
    .select()
    .from(activityLog)
    .where(and(eq(activityLog.entityType, entityType), eq(activityLog.entityId, entityId)))
    .orderBy(desc(activityLog.createdAt));
}
