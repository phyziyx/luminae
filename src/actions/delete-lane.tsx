"use server";

import AgencyManager from "@/lib/managers/agencyManager";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export default async function deleteLane(values: {
  workspaceId: string;
  laneId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  let error = "An error occurred while saving the workspace information";

  if (!user) {
    error = "A user who is not authenticated tried to create a lane.";
    return { error };
  }

  try {
    const agency = await AgencyManager.findUserAgency(user.email);

    // There is no agency associated with this account,
    // so this action cannot take place.
    if (!agency) {
      error = "User does not have an agency.";

      return { error };
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        agencyId: agency.agencyId,
        id: values.workspaceId,
      },
    });

    if (!workspace) {
      error = "Workspace not found";

      return { error };
    }

    // TODO: Check if the user has access to the workspace that they are trying to update
    // It is possible that their access has been revoked since the last time they accessed the workspace

    const lane = await prisma.lane.findFirst({
      where: {
        id: values.laneId,
        workspaceId: values.workspaceId,
      },
      select: {
        _count: {
          select: {
            tickets: {
              where: {
                laneId: {
                  equals: values.laneId,
                },
              },
            },
          },
        },
      },
    });

    if (!lane) {
      error = "Lane not found";

      return { error };
    }

    if (lane._count.tickets > 0) {
      error = "Lane has tickets. Cannot delete a lane with tickets.";

      return { error };
    }

    const deletedLane = await prisma.lane.deleteMany({
      where: {
        id: values.laneId,
        workspaceId: values.workspaceId,
      },
    });

    if (deletedLane.count > 0) {
      error = "";
    } else {
      error = "An error occurred while attempting to delete the lane.";
    }
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
