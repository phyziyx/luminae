import prisma from "../db";
import { v7 } from "uuid";

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
   * Checks if the agency already has a pending or approved request.
   */
  public static async hasActiveVerificationRequest(
    agencyId: string
  ): Promise<boolean> {
    const existing = await prisma.agencyVerification.findFirst({
      where: {
        agencyId,
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
    });

    return !!existing;
  }

  /**
   * Checks if the agency is blocked from submitting due to too many rejections.
   */
  public static async isAgencyBlockedFromVerification(
    agencyId: string
  ): Promise<boolean> {
    const lastAttempt = await prisma.agencyVerification.count({
      where: {
        agencyId,
        status: "REJECTED",
      },
    });

    return lastAttempt >= 3;
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

    const isBlocked = await this.isAgencyBlockedFromVerification(agencyId);
    if (isBlocked) {
      throw new Error(
        "This agency has been rejected too many times and cannot submit again."
      );
    }

    const hasActive = await this.hasActiveVerificationRequest(agencyId);
    if (hasActive) {
      throw new Error(
        "A verification request is already pending or approved for this agency."
      );
    }

    // Create a new verification request always

    return await prisma.agencyVerification.create({
      data: {
        id: v7(),
        message,
        agencyId,
        status: "PENDING",
      },
    });
  }
}

export default VerificationManager;
