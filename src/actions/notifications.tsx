"use server";

import NotificationManager from "@/lib/managers/notificationManager";
import { currentUser } from "@clerk/nextjs/server";

export const fetchNotificationsAction = async () => {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  return await NotificationManager.getForUser(user.id);
};

export const markAsReadAction = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  return await NotificationManager.markAsRead(user.id, id);
};

export const markAllAsReadAction = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  return await NotificationManager.markAllAsRead(user.id);
};
