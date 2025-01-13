// import { Client } from "@prisma/client";
import prisma from "../db";

// type CreateClient = Pick<
//   Client,
//   "id" | "name" | "email" | "city" | "state" | "country" | "status"
// >;

class ClientManager {
  public static async fetchClients(agencyId: string) {
    const clients = await prisma.client.findMany({
      where: {
        agencyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        country: true,
        status: true,
        tickets: {
          select: {
            value: true,
          },
        },
      },
    });
    return clients.map((client) => ({
      ...client,
      ticketSize: client.tickets.reduce(
        (acc, ticket) => acc + ticket.value.toNumber(),
        0
      ),
    }));
  }
}

export default ClientManager;
