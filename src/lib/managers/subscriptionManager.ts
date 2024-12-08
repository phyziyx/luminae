import prisma from "../db";

class SubscriptionManager {
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
