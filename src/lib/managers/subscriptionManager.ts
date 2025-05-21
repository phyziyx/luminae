import { FeatureCode } from "@prisma/client";
import prisma from "../db";
import PackageManager from "./packageManager";

class SubscriptionManager {
  public static async createFreePlan(agencyId: string) {
    const freePlan = await prisma.subscription.create({
      data: {
        currentPeriodEnd: new Date(1893456000),
        status: "ACTIVE",
        stripeCustomerId: " ",
        stripeSubscriptionId: " ",
        active: true,
        priceId: PackageManager.FREE_PLAN_PRICE_ID,
        agencyId,
        packageId: "01935e9e-0ecc-75c4-9cc7-b9ed4a1779a3",
      },
    });

    return freePlan;
  }

  public static async findByAgency(agencyId: string) {
    const foundPackage = await prisma.subscription.findFirst({
      where: {
        agencyId,
      },
      include: {
        package: {
          include: {
            features: true,
          },
        },
      },
    });

    return foundPackage;
  }

  public static async getFeatureLimit(
    agencyId: string,
    featureCode: FeatureCode
  ) {
    const subscription = await SubscriptionManager.findByAgency(agencyId);
    if (!subscription) {
      return null;
    }

    const feature = subscription.package.features.find(
      (f) => f.code === featureCode
    );
    if (!feature) {
      return null;
    }

    return {
      hasAccess: feature.hasAccess,
      maxLimit: feature.maxLimit,
    };
  }

  /**
   * Check if the agency has access to the file storage feature and if they have reached their limit.
   * @param agencyId The ID of the agency to check.
   */
  public static async checkFileStorageLimit(agencyId: string) {
    const limit = await SubscriptionManager.getFeatureLimit(
      agencyId,
      "FILE_STORAGE"
    );

    if (!limit || !limit.hasAccess || !limit.maxLimit || limit.maxLimit <= 0) {
      return {
        hasAccess: false,
        maxLimit: 0,
        used: 0,
        free: 0,
      };
    }

    const fileStorageUsage = await prisma.agencyFile.aggregate({
      _sum: {
        size: true,
      },
      where: {
        agencyId,
      },
    });

    const MEGA_BYTE = 1024 * 1024;
    const max = Math.ceil(limit.maxLimit * MEGA_BYTE);
    const used = Math.ceil((fileStorageUsage._sum.size || 0) / MEGA_BYTE);
    const free = Math.ceil((max - used) / MEGA_BYTE);

    return {
      hasAccess: free > 1,
      maxLimit: limit.maxLimit,
      used,
      free,
    };
  }
}

export default SubscriptionManager;
