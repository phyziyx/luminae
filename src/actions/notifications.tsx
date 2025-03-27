"use server";

import { auth } from "@/lib/auth/auth";
import NotificationManager from "@/lib/managers/notificationManager";
import { headers } from "next/headers";

export const fetchNotificationsAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  if (!user) {
    return [];
  }

  return await NotificationManager.getForUser(user.id);
};

export const markAsReadAction = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return;
  }

  return await NotificationManager.markAsRead(user.id, id);
};

export const markAllAsReadAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return;
  }

  return await NotificationManager.markAllAsRead(user.id);
};
