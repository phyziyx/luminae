"use client";

import {
  fetchNotificationsAction,
  markAllAsReadAction,
  markAsReadAction,
} from "@/actions/notifications";
import { Notification } from "@prisma/client";
import type React from "react";
import { createContext, useContext } from "react";
import useSWR from "swr";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  loading: boolean;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const { mutate } = useSWRConfig();
  const {
    data: notifications = [],
    isLoading: loading,
    mutate,
  } = useSWR(["notifications"], fetchNotificationsAction, {
    refreshInterval: 30_000,
    dedupingInterval: 1_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  console.log("[client] notifications", notifications);

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    await markAsReadAction(id);
    mutate();

    // const markAsRead = markAsReadAction.bind(null, id);
    // mutate("notifications", markAsRead, {
    //   optimisticData: (prev: Notification[]) =>
    //     prev.map((n: Notification) => (n.id === id ? { ...n, read: true } : n)),
    //   rollbackOnError: true,
    //   revalidate: false,
    // });
  };

  const markAllAsRead = async () => {
    await markAllAsReadAction();
    mutate();

    // mutate("notifications", markAllAsReadAction, {
    //   optimisticData: (prev: Notification[]) =>
    //     prev.map((n: Notification) => ({ ...n, read: true })),
    //   rollbackOnError: true,
    //   revalidate: false,
    // });
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications: notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        loading,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
