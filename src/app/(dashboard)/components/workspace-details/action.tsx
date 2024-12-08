"use server";

import { z } from "zod";
import formSchema from "./schema";
import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  const user = await currentUser();

  let error = "An error occurred while saving the workspace information";

  if (!user) {
    console.error("A user who is not authenticated tried to create an agency.");
    return;
  }

  const workspaceId = values.id;

  try {
    const agency = await AgencyManager.findUserAgency(
      user.emailAddresses[0].emailAddress
    );

    // There is no agency associated with this account,
    // so this action cannot take place.
    if (!agency) {
      error = "User does not have an agency.";

      return { error };
    }

    const agencyId = agency.agency.id;

    if (workspaceId) {
      // Update workspace

      const workspace = await AgencyManager.updateWorkspace({
        id: workspaceId,
        name: values.name,
        description: values.description,
        agencyId: agencyId,
      });

      if (!workspace) {
        error = "Failed to update workspace";
        return { error };
      }
    } else {
      const available = await AgencyManager.canUseFeature(
        agencyId,
        "WORKSPACE"
      );
      if (!available) {
        error = `You can not create more workspaces.  Limit reached.`;
        return { error };
      }

      const workspace = await AgencyManager.createWorkspace({
        name: values.name,
        description: values.description,
        agencyId: agencyId,
      });

      if (!workspace) {
        error = "Failed to create workspace";
        return { error };
      }
    }

    error = "";
  } catch (err) {
    error =
      "An error occurred while attempting to create or update the workspace.";
    console.error(err);
  }

  // Revalidate the cache
  revalidatePath("/dashboard", "page");

  return {
    error,
  };
};

export default onSubmit;
