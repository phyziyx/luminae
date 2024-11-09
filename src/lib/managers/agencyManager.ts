import { Agency, Role } from "@prisma/client";
import prisma from "../db";
import { v7 } from "uuid";

type CreateAgency = Omit<Agency, "id" | "createdAt" | "updatedAt">;

class AgencyManager {
  public static async createAgency(agency: CreateAgency, ownerEmail?: string) {
    const agencyId = v7();

    try {
      const createdAgency = await prisma.agency.create({
        data: {
          id: agencyId,
          address: agency.address,
          agencyLogo: agency.agencyLogo,
          city: agency.city,
          companyEmail: agency.companyEmail,
          companyPhone: agency.companyPhone,
          country: agency.country,
          name: agency.name,
          state: agency.state,
          zipCode: agency.zipCode,
        },
      });

      if (createdAgency && ownerEmail) {
        await prisma.agencyMember.upsert({
          where: {
            agencyId: createdAgency.id,
            email: ownerEmail,
          },
          update: {
            agencyId,
            email: ownerEmail,
            role: Role.AGENCY_OWNER,
          },
          create: {
            email: ownerEmail,
            agencyId: createdAgency.id,
            role: Role.AGENCY_OWNER,
          },
        });
      }

      return createdAgency;
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  /**
   * Find user agency
   * @param id agency id
   * @returns agency
   */
  public static async findUserAgency(userEmail: string) {
    return await prisma.agencyMember.findFirst({
      where: {
        email: userEmail,
      },
      include: {
        Agency: true,
        Permissions: true,
      },
    });
  }

  public static async findWorkspaces(agencyId: string) {
    return await prisma.workspace.findMany({
      where: {
        agencyId,
      },
    });
  }

  /**
   * Delete agency by id
   * @param id agency id
   * @returns deleted agency
   */
  public static async deleteAgency(agencyId: string) {
    return await prisma.agency.delete({
      where: {
        id: agencyId,
      },
    });
  }
}

export default AgencyManager;
