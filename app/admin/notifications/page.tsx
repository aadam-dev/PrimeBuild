import { Bell, Check } from "lucide-react";
import { requireSession, requireAdmin } from "@/lib/auth-server";
import { getUserNotifications, getUnreadCount } from "@/lib/db/queries/notifications";
import { NotificationsClient } from "./NotificationsClient";

export const metadata = { title: "Notifications | Admin" };

export default async function NotificationsPage() {
  const session = await requireSession();
  await requireAdmin(session);

  const [notifications, unread] = await Promise.all([
    getUserNotifications(session.user.id, 100),
    getUnreadCount(session.user.id),
  ]);

  const data = notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    link: n.link,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <Bell className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">Notifications</h2>
          <p className="text-sm text-slate-500">{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <NotificationsClient notifications={data} />
    </div>
  );
}
