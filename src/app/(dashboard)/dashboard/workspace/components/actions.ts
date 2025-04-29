"use server";

import { getSession } from "@/lib/auth/auth";
import AgencyManager from "@/lib/managers/agencyManager";
import { revalidatePath } from "next/cache";

export const deleteWorkspace = async (workspaceId: string) => {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      console.error("User is not authenticated to delete workspace");
      return;
    }

    const member = await AgencyManager.findUserAgency(user.email);
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
