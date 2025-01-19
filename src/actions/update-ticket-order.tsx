"use server";

import prisma from "@/lib/db";
// import { revalidatePath } from "next/cache";

export default async function updateTicketOrder(
  activeTicketId: string,
  overTicketId: string
) {
  console.log("\n");

  console.log("activeTicketId:", activeTicketId);
  console.log("overTicketId:", overTicketId);

  const ticket = await prisma.ticket.findFirst({
    select: {
      id: true,
      order: true,
    },
    where: {
      id: activeTicketId,
    },
  });

  const overTicket = await prisma.ticket.findFirst({
    select: {
      id: true,
      order: true,
    },
    where: {
      id: overTicketId,
    },
  });

  if (!ticket || !overTicket) {
    console.error("Ticket not found!");
    return;
  }

  const TicketOrder = ticket.order;
  const overTicketOrder = overTicket.order;

  await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      order: overTicketOrder,
    },
  });

  await prisma.ticket.update({
    where: {
      id: overTicket.id,
    },
    data: {
      order: TicketOrder,
    },
  });

  console.log("Ticket order updated!");

  // revalidatePath("/");
}
