import { v7 } from "uuid";
import prisma from "../db";
import { NotificationType } from "../types";

class NotificationManager {
  public static async getForUser(userId: string) {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      where: { userId },
    });

    return notifications;
  }

  public static async markAsRead(userId: string, id: string) {
    await prisma.notification.update({
      where: { id, userId },
      data: { read: true },
    });
  }

  public static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { read: false, userId },
      data: { read: true },
    });
  }

  // TICKET_ASSIGNED: "You have been assigned a new ticket",
  // WORKSPACE_ASSIGNED: "You have been assigned a new workspace",
  // WORKSPACE_MANAGER: "You have been assigned as a manager for a workspace",
  // AGENCY_ADMIN: "You have been assigned as the admin of your agency"

  public static async create(
    userId: string,
    message: string,
    resource?: {
      resourceType: NotificationType;
      resourceId: string;
    }
  ) {
    await prisma.notification.create({
      data: {
        id: v7(),
        userId,
        message,
        resourceId: resource?.resourceId || null,
        resourceType: resource?.resourceType || null,
      },
    });
  }
}

export default NotificationManager;
