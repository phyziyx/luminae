"use server";

import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteWorkspace = async (workspaceId: string, _prevState: any) => {
  try {
    const user = await currentUser();

    if (!user) {
      console.error("User is not authenticated to delete workspace");
      return;
    }

    console.log("Deleting workspace", workspaceId);

    const member = await AgencyManager.findUserAgency(
      user.emailAddresses[0].emailAddress
    );
    if (!member) {
      console.error("User is not a member of any agency");
      return;
    }

    const agencyId = member.agencyId;

    await AgencyManager.deleteWorkspace(agencyId, workspaceId);
    revalidatePath("/");

    return {
      error: null,
    };
  } catch (err) {
    console.error("Failed to delete workspace", err);
    return {
      error: err,
    };
  }
};
