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
import { clerkClient } from "@clerk/nextjs/server";
import { isAgencyAdmin } from "../utils";
import PackageManager from "./packageManager";

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

        // await SubscriptionManager.createFreePlan(agencyId);
      }

      return createdAgency;
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  /**
   * Fetch agency details by ID
   * @param agencyId ID of the agency
   * @returns agency details
   */
  public static async fetchAgencyDetails(agencyId: string) {
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
    });

    if (!agency) {
      throw new Error("Agency not found");
    }

    return {
      id: agency.id,
      name: agency.name,
      agencyLogo: agency.agencyLogo || "",
      companyEmail: agency.companyEmail || "",
      companyPhone: agency.companyPhone || "",
      stripeCustomerId: agency.stripeCustomerId || "",
      address: agency.address || "",
      city: agency.city || "",
      zipCode: agency.zipCode || "",
      state: agency.state || "",
      country: agency.country || "",
    };
  }

  public static async updateAgencyMemberRole(
    agencyId: string,
    email: string,
    role: Role
  ) {
    return await prisma.agencyMember.update({
      where: {
        agencyId,
        email,
      },
      data: {
        role,
      },
    });
  }

  public static async createInvitation(
    email: string,
    agencyId: string,
    role: Role
  ) {
    const clerk = await clerkClient();

    const response = await clerk.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}`,
      notify: true,
      ignoreExisting: true,
    });

    if (!response) {
      throw new Error("An error occurred while sending an invite.");
    }

    return await prisma.invitation.create({
      data: {
        email,
        agencyId,
        role,
        status: "PENDING",
      },
    });
  }

  public static async findWorkspace(workspaceId: string) {
    return await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
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
   * Create workspace
   * @param workspace workspace data
   * @returns created workspace
   */
  public static async createWorkspace(
    workspace: Omit<Workspace, "id" | "createdAt" | "updatedAt">
  ) {
    return await prisma.workspace.create({
      data: {
        name: workspace.name,
        agencyId: workspace.agencyId,
        description: workspace.description,
      },
    });
  }

  /**
   * Update workspace
   * @param workspace workspace data
   * @returns updated workspace
   */
  public static async updateWorkspace(
    workspace: Omit<Workspace, "createdAt" | "updatedAt">
  ) {
    return await prisma.workspace.update({
      where: {
        id: workspace.id,
      },
      data: {
        name: workspace.name,
        description: workspace.description,
      },
    });
  }

  /**
   * @param workspaceId workspace id
   * @returns deleted workspace
   */
  public static async deleteWorkspace(agencyId: string, workspaceId: string) {
    return await prisma.workspace.delete({
      where: {
        id: workspaceId,
        agencyId: agencyId,
      },
    });
  }

  /**
   * @param workspaceId workspace id
   * @returns workspace's kanban board lanes with all tickets
   */
  public static async getWorkspaceKanbanBoard(workspaceId: string) {
    const lanes = await prisma.lane.findMany({
      where: {
        workspaceId: workspaceId,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        Tickets: {
          include: {
            assigneeUser: true,
            Client: true,
          },
        },
      },
    });

    return lanes;
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

  public static async findAgencyMembers(agencyId: string) {
    return await prisma.agencyMember.findMany({
      where: {
        agencyId,
      },
      include: {
        user: true,
      },
    });
  }

  public static async canMemberAccessWorkspace(
    workspaceId: string,
    agencyId: string,
    userId: string
  ) {
    const member = await prisma.agencyMember.findFirst({
      where: {
        user: {
          id: userId,
        },
        agencyId,
      },
      include: {
        permissions: {
          where: {
            workspaceId,
          },
        },
      },
    });

    const access =
      !!member && (member.permissions.length > 0 || isAgencyAdmin(member.role));

    return {
      access,
      manager: access && member.permissions[0]?.manager,
    };
  }

  public static async findAgencyMembersByWorkspaceId(
    workspaceId: string,
    agencyId: string
  ) {
    const members = await prisma.agencyMember.findMany({
      where: {
        OR: [
          {
            permissions: {
              some: {
                workspaceId,
              },
            },
          },
          {
            OR: [
              {
                AND: {
                  role: Role.AGENCY_OWNER,
                  agencyId,
                },
              },
              {
                AND: {
                  role: Role.AGENCY_ADMIN,
                  agencyId,
                },
              },
            ],
          },
        ],
      },
      include: {
        user: true,
      },
    });

    return members;
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

    // If the user is an agency admin or owner, return all workspaces
    if (isAgencyAdmin(agencyMember.role)) {
      return workspaces;
    }

    return workspaces.filter((workspace) =>
      agencyMember.permissions.some(
        (permission) => permission.workspaceId === workspace.id
      )
    );
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
    const INFINITE = -1;

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

    if (!agency) {
      throw new Error("Agency not found");
    }

    let subPack = await PackageManager.getPackageByPriceId(
      PackageManager.FREE_PLAN_PRICE_ID
    );

    if (agency.subscription) {
      subPack = agency.subscription.package;
    }

    const feature = subPack!.features.find(
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
        return (
          feature.maxLimit === INFINITE ||
          totalMembers < (feature.maxLimit || 0)
        );

      case "WORKSPACE":
        const currentWorkspaceCount = agency.workspaces.length;

        console.log("currentWorkspaceCount", currentWorkspaceCount);
        console.log("feature.maxLimit", feature.maxLimit);

        return (
          feature.maxLimit === INFINITE ||
          currentWorkspaceCount < (feature.maxLimit || 0)
        );

      default:
        throw new Error(`Feature code ${featureCode} is not supported`);
    }
  }

  public static async isInvitationCreated(email: string) {
    const invitation = await prisma.invitation.findFirst({
      where: {
        email,
      },
    });

    return !!invitation;
  }

  public static async getFeatureMaxCount(
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

    if (!agency) {
      throw new Error("Agency not found");
    }

    let subPack = await PackageManager.getPackageByPriceId(
      PackageManager.FREE_PLAN_PRICE_ID
    );

    if (agency.subscription) {
      subPack = agency.subscription.package;
    }

    const feature = subPack!.features.find(
      (feature) => feature.code === featureCode
    );

    if (!feature) {
      throw new Error(`${featureCode} feature not found in the package`);
    }

    switch (featureCode) {
      case "TEAM_MEMBERS":
        return feature.maxLimit;

      case "WORKSPACE":
        return feature.maxLimit;

      default:
        throw new Error(`Feature code ${featureCode} is not supported`);
    }
  }

  public static async getAllAgenciesCount() {
    return await prisma.agency.count();
  }

  public static async findClients(agencyId: string) {
    return await prisma.client.findMany({
      where: {
        agencyId,
      },
    });
  }

  public static async findWorkspacesCount(agencyId: string) {
    return await prisma.workspace.count({
      where: {
        agencyId,
      },
    });
  }

  public static async findClientsCount(agencyId: string) {
    return await prisma.client.count({
      where: {
        agencyId,
      },
    });
  }

  public static async findMembersCount(agencyId: string) {
    return await prisma.agencyMember.count({
      where: {
        agencyId,
      },
    });
  }

  public static async findInvitationsCount(agencyId: string) {
    return await prisma.invitation.count({
      where: {
        agencyId,
      },
    });
  }

  public static async getRegistrationRate() {
    // Find the number of agencies that have registered in the last 30 days (this month)
    // and compare it to the 30 days before that (last 60-30 days).

    const now = new Date();
    const thirtyDaysAgo = new Date();
    const sixtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(now.getDate() - 30);
    sixtyDaysAgo.setDate(now.getDate() - 60);

    const thisMonthCount = await prisma.agency.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo, // Registered in the last 30 days
        },
      },
    });

    const lastMonthCount = await prisma.agency.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo, // Registered in the 30 days before this month
          lt: thirtyDaysAgo,
        },
      },
    });

    return {
      thisMonth: thisMonthCount,
      lastMonth: lastMonthCount,
      difference:
        ((thisMonthCount - lastMonthCount) / (lastMonthCount || 1)) * 100,
    };
  }
}

export default AgencyManager;
