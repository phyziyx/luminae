"use server";

import { z } from "zod";
import formSchema from "./schema";
import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

const onUpdateMember = async (values: z.infer<typeof formSchema>) => {
  const user = await currentUser();

  let error = "An error occurred while sending an invite.";

  if (!user) {
    console.error("A user who is not authenticated tried to invite a member.");
    return;
  }

  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  const { email, role, workspaces } = validatedFields.data;

  try {
    const agency = await AgencyManager.findUserAgency(
      user.emailAddresses[0].emailAddress
    );

    if (!agency) {
      error = "User does not have an agency.";
      return { error };
    }

    if (!["AGENCY_OWNER", "AGENCY_ADMIN"].includes(agency.role)) {
      error = "User does not have permission to update members.";
      return { error };
    }

    //

    const agencyMember = await AgencyManager.findUserAgency(email);
    if (!agencyMember) {
      error = "User is not a member of the agency.";
      return { error };
    }

    if (role !== "AGENCY_OWNER" && role !== agencyMember.role) {
      // Update the role, only if the role is not the same as the current role
      // and the role is not an owner role.
      await AgencyManager.updateAgencyMemberRole(
        agencyMember.agencyId,
        email,
        role
      );
    }

    // Update the workspaces
    const agencyWorkspaces = await AgencyManager.findWorkspaces(
      agencyMember.agencyId
    );

    const agencyWorkspaceIds = agencyWorkspaces.map(
      (workspace) => workspace.id
    );

    // The reason we've done this is because the user can forge a request to add
    // to a workspace that they are not a member of. This is a security measure.
    const filteredWorkspaces = workspaces.filter((workspace) =>
      agencyWorkspaceIds.includes(workspace.id)
    );

    for (const workspace of filteredWorkspaces) {
      const workspaceMember = await prisma.permission.findFirst({
        where: {
          workspaceId: workspace.id,
          agencyMemberId: agencyMember.id,
        },
      });

      if (workspace.access || workspace.manager) {
        await prisma.permission.upsert({
          where: {
            id: workspaceMember?.id,
            agencyMemberId: agencyMember.id,
            workspaceId: workspace.id,
          },
          update: {
            access: workspace.access || workspace.manager,
            manager: workspace.manager,
          },
          create: {
            access: workspace.access || workspace.manager,
            manager: workspace.manager,
            agencyMemberId: agencyMember.id,
            workspaceId: workspace.id,
          },
        });
      } else if (workspaceMember) {
        await prisma.permission.delete({
          where: {
            id: workspaceMember.id,
          },
        });
      }
    }

    error = "";
    return { error };
  } catch (err) {
    error = "An error occurred while attempting to update member information.";
    console.error(err);
  }

  return {
    error,
  };
};

export default onUpdateMember;
