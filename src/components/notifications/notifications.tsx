"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./item";
import { useNotifications } from "@/providers/notifications-provider";
import { Bell, CheckCheckIcon } from "lucide-react";

export const NotificationsPopover: React.FC = () => {
  const t = useTranslations();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Notifications ${
              unreadCount > 0 ? `, ${unreadCount} unread` : ""
            }`}
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {t("NOTIFICATIONS.TITLE")}
            </h2>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheckIcon />
              {t("NOTIFICATIONS.MARK_ALL_READ")}
            </Button>
          </div>
          <Tabs defaultValue="unread">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unread">
                {t("NOTIFICATIONS.UNREAD")}
              </TabsTrigger>
              <TabsTrigger value="read">{t("NOTIFICATIONS.READ")}</TabsTrigger>
            </TabsList>
            <TabsContent value="unread">
              <ScrollArea className="min-h-[100px] max-h-[300px]">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    {t("NOTIFICATIONS.NO_UNREAD")}
                  </p>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="read">
              <ScrollArea className="min-h-[100px] max-h-[300px]">
                {readNotifications.length > 0 ? (
                  readNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={() => {}}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    {t("NOTIFICATIONS.NO_READ")}
                  </p>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};
