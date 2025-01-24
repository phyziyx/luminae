"use client";

import {
  fetchNotificationsAction,
  markAllAsReadAction,
  markAsReadAction,
} from "@/actions/notifications";
import { Notification } from "@prisma/client";
import type React from "react";
import { createContext, useContext, useMemo } from "react";
import useSWR from "swr";

interface NotificationsContextType {
  readNotifications: Notification[];
  unreadNotifications: Notification[];
  unreadCount: number;
  loading: boolean;
  //
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
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

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );
  const readNotifications = useMemo(
    () => notifications.filter((n) => n.read),
    [notifications]
  );
  const unreadCount = useMemo(
    () => (notifications || []).filter((n) => !n.read).length,
    [notifications]
  );

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
        unreadNotifications,
        readNotifications,
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
