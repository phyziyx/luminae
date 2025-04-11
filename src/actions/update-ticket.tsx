"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { laneTicketFormSchema, LaneTicketFormSchema } from "@/lib/forms";
import AgencyManager from "@/lib/managers/agencyManager";
import NotificationManager from "@/lib/managers/notificationManager";
import { TicketTag } from "@prisma/client";
import { revalidatePath } from "next/cache";

export default async function onUpdateTicket(values: LaneTicketFormSchema) {
  const session = await getSession();
  const user = session?.user;

  let error = "An error occurred while saving the workspace information";

  if (!user) {
    error = "A user who is not authenticated tried to create a lane.";
    return { error };
  }

  const validatedFields = laneTicketFormSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
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

    const lane = await prisma.lane.findFirst({
      where: {
        id: values.laneId,
      },
    });

    if (!lane) {
      error = "Lane not found";

      return { error };
    }

    // verify ticket tag
    if (!Object.values(TicketTag).includes(values.tag as TicketTag)) {
      error = "Invalid ticket tag provided.";

      return { error };
    }

    // TODO: Check if the user has access to the workspace that they are trying to update
    // It is possible that their access has been revoked since the last time they accessed the workspace

    const isCreating = !values.id;

    if (isCreating) {
      const ticketsCount = await prisma.ticket.count({
        where: {
          laneId: values.laneId,
        },
      });

      await prisma.ticket.create({
        data: {
          laneId: values.laneId,
          title: values.name,
          description: values.description,
          open: true,
          value: Number(values.value),
          tag: values.tag as TicketTag,
          clientId: values.clientId || null,
          assigneeUserId: values.userId || null,
          order: ticketsCount,
        },
      });

      if (values.userId) {
        await NotificationManager.create(values.userId, "TICKET_ASSIGNED", {
          resourceId: lane.workspaceId,
          resourceType: "workspace",
        });
      }
    } else {
      const assigneeId = await prisma.ticket.findFirst({
        where: {
          id: values.id,
          laneId: values.laneId,
        },
        select: {
          assigneeUserId: true,
        },
      });

      if (values.userId && values.userId !== assigneeId?.assigneeUserId) {
        await NotificationManager.create(values.userId, "TICKET_ASSIGNED", {
          resourceId: lane.workspaceId,
          resourceType: "workspace",
        });
      }

      await prisma.ticket.update({
        data: {
          title: values.name,
          description: values.description,
          open: values.open,
          value: Number(values.value),
          tag: values.tag as TicketTag,
          clientId: values.clientId || null,
          assigneeUserId: values.userId || null,
          // order: values.order
        },
        where: {
          id: values.id,
          laneId: values.laneId,
        },
      });
    }

    error = "";
  } catch (err) {
    error = "An error occurred while attempting to create a lane.";
    console.error(err);
  }

  // Revalidate the cache
  revalidatePath("/");

  return {
    error,
  };
}
