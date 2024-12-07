"use server";

import { z } from "zod";
import formSchema from "./schema";
import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  console.log("values", values);

  const user = await currentUser();

  if (!user) {
    console.error("A user who is not authenticated tried to create an agency.");
    return;
  }

  const workspaceId = values.id;

  try {
    console.log(values);

    const agency = await AgencyManager.findUserAgency(
      user.emailAddresses[0].emailAddress
    );

    // There is no agency associated with this account,
    // so this action cannot take place.
    if (!agency) {
      console.error("User does not have an agency.");
      return;
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
        console.error("Failed to update workspace");
        return;
      }
    } else {
      const available = await AgencyManager.canUseFeature(
        agencyId,
        "WORKSPACE"
      );
      if (!available) {
        console.error("User does not have permission to create a workspace.");
        return;
      }

      const workspace = await AgencyManager.createWorkspace({
        name: values.name,
        description: values.description,
        agencyId: agencyId,
      });

      if (!workspace) {
        console.error("Failed to create workspace");
        return;
      }
    }

    // Revalidate the cache
    revalidatePath("/dashboard", "page");
  } catch (error) {
    console.error("Failed to update agency", error);
  }

  return;
};

export default onSubmit;
