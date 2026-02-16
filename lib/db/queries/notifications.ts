import { desc, eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";

export async function createNotification(params: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  if (!db) return;
  await db.insert(notifications).values({
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    link: params.link ?? null,
  });
}

export async function notifyAdmins(params: {
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  if (!db) return;
  const { profile } = await import("@/lib/db/schema");
  const admins = await db
    .select({ id: profile.id })
    .from(profile)
    .where(eq(profile.role, "admin"));
  for (const admin of admins) {
    await createNotification({ ...params, userId: admin.id });
  }
}

export async function getUserNotifications(userId: string, limit = 50) {
  if (!db) return [];
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadCount(userId: string) {
  if (!db) return 0;
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return row?.count ?? 0;
}

export async function markAsRead(notificationId: string) {
  if (!db) return;
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
}

export async function markAllAsRead(userId: string) {
  if (!db) return;
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}
