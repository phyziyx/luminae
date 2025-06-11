import prisma from "../db";

class VerificationManager {
  /**
   * Gets the agency ID associated with a given user ID.
   */
  public static async getAgencyIdByUserId(userId: string): Promise<string> {
    const member = await prisma.agencyMember.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        agencyId: true,
      },
    });

    if (!member?.agencyId) {
      throw new Error("You need to be part of or create an agency first.");
    }

    return member.agencyId;
  }

  /**
   * Creates a new verification request.
   */
  public static async createVerification({
    name,
    email,
    message,
    agencyId,
  }: {
    name: string;
    email: string;
    message: string;
    agencyId: string;
  }) {
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      select: { name: true },
    });

    if (!agency) {
      throw new Error("Associated agency not found.");
    }

    return await prisma.agencyVerification.create({
      data: {
        name,
        email,
        message,
        agencyId,
        agencyName: agency.name,
        status: "PENDING",
      },
    });
  }
}

export default VerificationManager;
