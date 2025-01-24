import { v7 } from "uuid";
import prisma from "../db";

class NotificationManager {
  public static async getForUser(userId: string) {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
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

  public static async create(userId: string, message: string) {
    await prisma.notification.create({
      data: {
        id: v7(),
        userId,
        message,
      },
    });
  }
}

export default NotificationManager;
