"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Notification } from "@/generated/prisma/client";
import { EyeIcon, Link2Icon } from "lucide-react";
import Link from "next/link";
import { getLinkByResourceType } from "@/lib/utils";
import { NotificationType } from "@/lib/types";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const t = useTranslations("NOTIFICATIONS");

  const getLocalizedMessage = (notification: Notification) => {
    const baseMessage = t(`ACTIONS.${notification.message}`);
    // if (notification.metadata) {
    //   return Object.entries(notification.metadata).reduce(
    //     (message, [key, value]) => {
    //       return message.replace(`{${key}}`, value);
    //     },
    //     baseMessage
    //   );
    // }
    return baseMessage;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 bg-blue-100/50 dark:bg-muted rounded-xl">
      <div>
        <p className="text-sm font-medium text-wrap">
          {getLocalizedMessage(notification)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {notification.createdAt.toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col">
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
            aria-label={t("MARK_AS_READ")}
          >
            <EyeIcon />
          </Button>
        )}
        {notification.resourceType && notification.resourceId && (
          <Link
            href={
              getLinkByResourceType(
                notification.resourceType as NotificationType,
                notification.resourceId
              ) ?? ""
            }
          >
            <Button variant="ghost" size="sm" aria-label={t("VIEW")}>
              <Link2Icon />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
