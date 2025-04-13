import { Client } from "@/generated/prisma/client";
import prisma from "../db";

type UpsertClient = Omit<Client, "createdAt" | "updatedAt" | "agencyId">;

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
      ticketSize: client.tickets.reduce((acc, ticket) => acc + ticket.value, 0),
    }));
  }

  public static async fetchClientDetails(clientId: string) {
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
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
      },
    });
    return client;
  }

  public static async upsertClient(client: UpsertClient, agencyId: string) {
    await prisma.client.upsert({
      where: {
        id: client.id,
      },
      create: {
        agencyId: agencyId,
        ...client,
      },
      update: {
        ...client,
      },
    });
  }
}

export default ClientManager;
