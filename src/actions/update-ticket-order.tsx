"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function updateTicketOrder(
  tickets: { id: string; order: number; laneId: string }[]
) {
  await prisma.$transaction(
    tickets.map((ticket, index) =>
      prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: index,
          laneId: ticket.laneId,
        },
      })
    )
  );

  console.log("Ticket order updated!");

  revalidatePath("/");
}
