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
}

export default SubscriptionManager;
