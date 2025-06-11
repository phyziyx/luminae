import prisma from "../db";
import { BadgeKey, SimpleBadge } from "../types";

class BadgeManager {
  public static async awardAchievement(profileId: string, key: BadgeKey) {
    await prisma.profileBadge.upsert({
      where: {
        profileId_badgeId: { profileId, badgeId: key },
      },
      update: {},
      create: {
        profileId,
        badgeId: key,
      },
    });
  }

  public static async getRecentBadges(profileId: string, limit: number = 10) {
    const records = await prisma.profileBadge.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        createdAt: true,
        badge: {
          select: {
            icon: true,
            key: true,
          },
        },
      },
    });

    return records.map(
      (record) =>
        ({
          icon: record.badge.icon,
          key: record.badge.key as BadgeKey,
          createdAt: record.createdAt.valueOf(),
        } satisfies SimpleBadge)
    );
  }
}

export default BadgeManager;
