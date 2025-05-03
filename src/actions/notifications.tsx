"use server";

import { getSession } from "@/lib/auth/auth";
import NotificationManager from "@/lib/managers/notificationManager";

export const fetchNotificationsAction = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }

  return await NotificationManager.getForUser(user.id);
};

export const markAsReadAction = async (id: string) => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return;
  }

  return await NotificationManager.markAsRead(user.id, id);
};

export const markAllAsReadAction = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return;
  }

  return await NotificationManager.markAllAsRead(user.id);
};
