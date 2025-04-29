"use server";

import { getSession } from "@/lib/auth/auth";
import AgencyManager from "@/lib/managers/agencyManager";

export default async function fetchMembersByWorkspace(workspaceId: string) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }

  const member = await AgencyManager.findUserAgency(user.email);

  if (!member) {
    return [];
  }

  const members = await AgencyManager.findAgencyMembersByWorkspaceId(
    workspaceId,
    member.agencyId
  );

  return members;
}
