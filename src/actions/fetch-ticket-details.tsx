"use server";

import prisma from "@/lib/db";

export default async function fetchTicketDetails(ticketId: string) {
  // const session = await getSession();
  // const user = session?.user;

  // let error = "An error occurred while saving the workspace information";

  // if (!user) {
  //   error = "A user who is not authenticated tried to create a lane.";
  //   return { error };
  // }

  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
  });

  // if (!ticket) {
  //   error = "Ticket not found";

  //   return { error };
  // }

  // revalidatePath("/");

  return ticket;
}
