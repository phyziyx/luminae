import {
  Agency,
  AgencyMember,
  FeatureCode,
  Permission,
  Role,
  Workspace,
} from "@prisma/client";
import prisma from "../db";
import { v7 } from "uuid";

type CreateAgency = Omit<
  Agency,
  "id" | "createdAt" | "updatedAt" | "stripeCustomerId"
>;

type UpdateAgency = Omit<
  Agency,
  "createdAt" | "updatedAt" | "stripeCustomerId"
>;

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

  public static async updateAgency(agency: UpdateAgency) {
    return await prisma.agency.update({
      where: {
        id: agency.id,
      },
      data: {
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
        agency: true,
        permissions: true,
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

  public static async findAndFilterWorkspaces(email: string) {
    const agencyMember = await AgencyManager.findUserAgency(email);
    if (!agencyMember) return [];

    const workspaces = await prisma.workspace.findMany({
      where: {
        agencyId: agencyMember.agencyId,
      },
    });

    return this.filterWorkspaces(workspaces, agencyMember);
  }

  public static filterWorkspaces(
    workspaces: Workspace[],
    agencyMember: AgencyMember & { permissions: Permission[] }
  ) {
    if (!workspaces || workspaces.length === 0) return [];

    if (
      agencyMember.role === "AGENCY_ADMIN" ||
      agencyMember.role === "AGENCY_OWNER"
    ) {
      // No need to filter workspaces
    } else {
      workspaces = workspaces.filter((workspace) =>
        agencyMember.permissions.some(
          (permission) => permission.workspaceId === workspace.id
        )
      );
    }

    return workspaces;
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

  /**
   * Find agency by the Stripe customer ID or Email
   * @param customerId Stripe Customer ID or Email associated with the agency
   * @returns the associated agency
   */
  public static async findAgencyByStripeCustomer(
    customerIdOrEmail: string,
    includeSubscription = false
  ) {
    return await prisma.agency.findFirst({
      where: {
        OR: [
          {
            companyEmail: customerIdOrEmail,
          },
          {
            stripeCustomerId: customerIdOrEmail,
          },
        ],
      },
      include: {
        subscription: includeSubscription,
      },
    });
  }

  /**
   * Check if the agency can use the feature
   * @param agencyId agency id
   * @param featureCode feature code
   * @returns true if the agency can use the feature, false otherwise.
   */

  public static async canUseFeature(
    agencyId: string,
    featureCode: FeatureCode
  ) {
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      include: {
        subscription: {
          include: {
            package: {
              include: {
                features: true,
              },
            },
          },
        },
        agencyMembers: true,
        invitations: true,
        workspaces: true,
      },
    });

    if (!agency || !agency.subscription) {
      throw new Error("Agency or subscription not found");
    }

    const feature = agency.subscription.package.features.find(
      (feature) => feature.code === featureCode
    );

    if (!feature) {
      throw new Error(`${featureCode} feature not found in the package`);
    }

    switch (featureCode) {
      case "TEAM_MEMBERS":
        const currentMemberCount = agency.agencyMembers.filter(
          (member) => !!member
        ).length;

        const pendingInvitesCount = agency.invitations.filter(
          (invite) => invite.status === "ACCEPTED"
        ).length;
        const totalMembers = currentMemberCount + pendingInvitesCount;
        return totalMembers < (feature.maxLimit || 0);

      case "WORKSPACE":
        const currentWorkspaceCount = agency.workspaces.length;
        return currentWorkspaceCount < (feature.maxLimit || 0);

      default:
        throw new Error(`Feature code ${featureCode} is not supported`);
    }
  }
}

export default AgencyManager;
