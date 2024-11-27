import prisma from "../db";

class SubscriptionManager {
  public static async findByAgency(agencyId: string) {
    return await prisma.subscription.findFirst({
      where: {
        agencyId,
      },
      include: {
        agency: true,
      },
    });
  }
}

export default SubscriptionManager;
