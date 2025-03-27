"use server";

import { z } from "zod";
import formSchema from "./schema";
import AgencyManager from "@/lib/managers/agencyManager";

import prisma from "@/lib/db";
import NotificationManager from "@/lib/managers/notificationManager";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

const onUpdateMember = async (values: z.infer<typeof formSchema>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

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
    const agency = await AgencyManager.findUserAgency(user.email);

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

      if (role === "AGENCY_ADMIN") {
        await NotificationManager.create(agencyMember.id, "AGENCY_ADMIN");
      }
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

      // Three possible cases:
      // 1. The user is not a member of the workspace, but the user is being added.
      // 2. The user is a member of the workspace, and the user is being updated.
      // 3. The user is a member of the workspace, but the user is being removed.

      if (!workspaceMember && (workspace.access || workspace.manager)) {
        await prisma.permission.create({
          data: {
            access: workspace.access || workspace.manager,
            manager: workspace.manager,
            agencyMemberId: agencyMember.id,
            workspaceId: workspace.id,
          },
        });

        await NotificationManager.create(
          agencyMember.id,
          workspace.manager ? "WORKSPACE_MANAGER" : "WORKSPACE_ASSIGNED",
          {
            resourceId: workspace.id,
            resourceType: "workspace",
          }
        );
      } else if (workspaceMember && (workspace.access || workspace.manager)) {
        await prisma.permission.update({
          where: {
            id: workspaceMember.id,
          },
          data: {
            access: workspace.access || workspace.manager,
            manager: workspace.manager,
          },
        });

        if (workspace.manager) {
          await NotificationManager.create(
            agencyMember.id,
            "WORKSPACE_MANAGER",
            {
              resourceId: workspace.id,
              resourceType: "workspace",
            }
          );
        }
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
