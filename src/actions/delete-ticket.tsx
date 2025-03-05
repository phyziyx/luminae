"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export default async function deleteTicket(values: { ticketId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
