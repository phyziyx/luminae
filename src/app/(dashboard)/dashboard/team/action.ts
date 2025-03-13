"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import AgencyManager from "@/lib/managers/agencyManager";
import UserManager from "@/lib/managers/userManager";
import { headers } from "next/headers";

export default async function getTeamMemberDetails(memberId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    console.log("User not found");
    throw new Error("User not found");
  }

  const memberUser = await UserManager.findUser(memberId);
  if (!memberUser) {
    throw new Error("Member not found");
  }

  const member = await AgencyManager.findUserAgency(memberId);
  if (!member) {
    throw new Error("Member not found");
  }

  const allWorkspaces = await AgencyManager.findWorkspaces(member.agencyId);

  const memberWorkspaces = await prisma.workspace.findMany({
    where: {
      permissions: {
        some: {
          agencyMember: {
            email: member.email,
          },
        },
      },
    },
    include: {
      permissions: {
        include: {
          agencyMember: true,
        },
      },
    },
  });

  const workspaces = allWorkspaces.map((workspace) => {
    const memberWorkspace = memberWorkspaces.find(
      (mw) => mw.id === workspace.id
    );

    return {
      ...workspace,
      access: memberWorkspace?.permissions[0].access || false,
      manager: memberWorkspace?.permissions[0].manager || false,
    };
  });

  return {
    member: memberUser,
    role: member.role,
    workspaces,
  };
}
