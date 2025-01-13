"use server";

import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser } from "@clerk/nextjs/server";

export default async function fetchMembersByWorkspace(workspaceId: string) {
  const user = await currentUser();

  let error = "An error occurred while saving the workspace information";

  if (!user) {
    return [];
  }

  const member = await AgencyManager.findUserAgency(
    user.emailAddresses[0].emailAddress
  );

  if (!member) {
    return [];
  }

  const members = await AgencyManager.findAgencyMembersByWorkspaceId(
    workspaceId,
    member.agencyId
  );

  return members;
}
