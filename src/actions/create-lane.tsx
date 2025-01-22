"use server";

import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { v7 } from "uuid";
import { createLaneSchema, CreateLaneSchema } from "@/lib/forms";
import { revalidatePath } from "next/cache";

export default async function onCreateLane(values: CreateLaneSchema) {
  const user = await currentUser();

  let error = "An error occurred while saving the workspace information";

  if (!user) {
    error = "A user who is not authenticated tried to create a lane.";
    return { error };
  }

  const validatedFields = createLaneSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  const workspaceId = values.workspaceId;
  const laneId = values.id;

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

    const workspace = await prisma.workspace.findFirst({
      where: {
        agencyId: agency.agencyId,
        id: workspaceId,
      },
    });

    if (!workspace) {
      error = "Workspace not found";

      return { error };
    }

    // TODO: Check if the user has access to the workspace that they are trying to update
    // It is possible that their access has been revoked since the last time they accessed the workspace

    if (laneId) {
      await prisma.lane.update({
        data: {
          colour: values.colour,
          name: values.name,
        },
        where: {
          id: laneId,
        },
      });
    } else {
      const lanesCount = await prisma.lane.count({
        where: {
          workspaceId: workspace.id,
        },
      });

      const lane = await prisma.lane.create({
        data: {
          colour: values.colour,
          name: values.name,
          workspaceId: workspace.id,
          id: v7(),
          order: lanesCount,
        },
      });

      if (!lane) {
        error = "An error occurred while creating the lane.";

        return { error };
      }
    }

    error = "";
  } catch (err) {
    error = "An error occurred while attempting to create a lane.";
    console.error(err);
  }

  // Revalidate the cache
  revalidatePath(`/`);

  return {
    error,
  };
}
