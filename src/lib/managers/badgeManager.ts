import prisma from "../db";
import { BadgeKey, SimpleBadge } from "../types";

type AwardBadgeTo =
  | {
      userId: string;
    }
  | {
      agencyId: string;
    }
  | {
      profileId: string;
    };

class BadgeManager {
  public static async awardAchievement(to: AwardBadgeTo, key: BadgeKey) {
    let profileId: string | undefined;

    if ("profileId" in to) {
      profileId = to.profileId;
    } else if ("userId" in to) {
      const profile = await prisma.userProfile.findUnique({
        where: { userId: to.userId },
        select: { profileId: true },
      });

      profileId = profile?.profileId;
    } else if ("agencyId" in to) {
      const profile = await prisma.agencyProfile.findUnique({
        where: { agencyId: to.agencyId },
        select: { profileId: true },
      });

      profileId = profile?.profileId;
    }

    if (!profileId) {
      return;
    }

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
