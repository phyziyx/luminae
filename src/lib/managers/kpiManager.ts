import prisma from "../db";
// import { Client } from "@clerk/backend";
import AgencyManager from "./agencyManager";

class KpiManager {
  public static async fetchAgencyKpi(agencyId: string) {
    const incomes = await prisma.client.findMany({
      where: {
        agencyId,
      },
      select: {
        status: true,
        tickets: {
          select: {
            value: true,
            open: true,
          },
        },
      },
    });

    const tickets = await prisma.ticket.findMany({
      where: {
        open: true,
        Lane: {
          Workspace: {
            agencyId,
          },
        },
      },
    });

    return {
      income: incomes.reduce(
        (acc, client) =>
          acc +
          client.tickets.reduce(
            (acc, ticket) => (ticket.open ? acc + ticket.value : 0),
            0
          ),
        0
      ),
      potentialIncome: incomes.reduce(
        (acc, client) =>
          acc + client.tickets.reduce((acc, ticket) => acc + ticket.value, 0),
        0
      ),
      workspaces: await AgencyManager.findWorkspacesCount(agencyId),
      tickets: tickets.length,
    };
  }
}

export default KpiManager;
