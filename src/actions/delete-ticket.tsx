"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteTicket(values: { ticketId: string }) {
  const session = await getSession();
  const user = session?.user;

  let error = "An error occurred while saving the workspace information";

  if (!user) {
    error = "A user who is not authenticated tried to delete a ticket.";
    return { error };
  }

  if (!values.ticketId) {
    error = "No ticket ID provided.";
    return { error };
  }

  try {
    await prisma.ticket.deleteMany({
      where: {
        id: values.ticketId,
      },
    });

    error = "";
  } catch (err) {
    error = "An error occurred while attempting to delete a ticket.";
    console.error(err);
  }

  // Revalidate the cache
  revalidatePath("/");

  return {
    error,
  };
}
