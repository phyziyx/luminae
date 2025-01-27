import prisma from "../db";
// import { Client } from "@clerk/backend";
import AgencyManager from "./agencyManager";

class KpiManager {
  public static async fetchAgencyKpi(agencyId: string) {
    const data = await prisma.client.findMany({
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

    const openTicketsCount = await prisma.ticket.count({
      where: {
        open: true,
        Lane: {
          Workspace: {
            agencyId,
          },
        },
      },
    });

    // Calculate income and potentialIncome using a single iteration
    let income = 0;
    let potentialIncome = 0;

    for (const client of data) {
      for (const ticket of client.tickets) {
        // Income only considers ACTIVE clients and open tickets
        if (client.status === "ACTIVE" && ticket.open) {
          income += ticket.value;
        }
        // Potential income adds all ticket values, regardless of status or open state
        potentialIncome += ticket.value;
      }
    }

    return {
      income,
      potentialIncome,
      workspaces: await AgencyManager.findWorkspacesCount(agencyId),
      tickets: openTicketsCount,
    };
  }

  public static async fetchClientsOnboardedByMonth(agencyId: string) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Ensure it's the first day of the month

    // Fetch clients added in the last 6 months with an active status
    const clientsData = await prisma.client.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: sixMonthsAgo, // Only consider clients created in the last 6 months
        },
        agencyId,
        status: "ACTIVE", // Only active clients
      },
      _count: {
        id: true, // Count the number of clients
      },
    });

    // Initialize the result array for monthly data
    const monthlyClientsOnboarded = Array(6)
      .fill(0)
      .map((_, index) => {
        const currentMonth = new Date();
        currentMonth.setMonth(currentMonth.getMonth() - (5 - index));
        return {
          month: currentMonth.toLocaleString("default", { month: "long" }),
          clientsOnboarded: 0,
        };
      });

    // Process the fetched data and populate the monthly counts
    clientsData.forEach((client) => {
      const clientDate = new Date(client.createdAt);
      const monthDifference =
        clientDate.getFullYear() * 12 +
        clientDate.getMonth() -
        (sixMonthsAgo.getFullYear() * 12 + sixMonthsAgo.getMonth());

      if (monthDifference >= 0 && monthDifference < 6) {
        const monthIndex = monthDifference;
        monthlyClientsOnboarded[monthIndex].clientsOnboarded +=
          client._count.id;
      }
    });

    return monthlyClientsOnboarded;
  }

  public static async fetchClientClosingRate(agencyId: string) {
    const clientStatuses = await prisma.client.groupBy({
      by: ["status"],
      where: {
        agencyId,
        status: {
          in: ["LEAD", "ACTIVE", "LOST"], // Filter by lead, active, and lost statuses
        },
      },
      _count: {
        status: true, // Get the count for each status
      },
    });

    // Initialize counters to 0 for each status
    let activeClients = 0;
    let lostClients = 0;
    let leadsClients = 0;

    // Iterate over the clientStatuses to assign the correct counts, handling null values
    clientStatuses.forEach((statusData) => {
      if (statusData.status === "ACTIVE") {
        activeClients = statusData._count.status || 0;
      }
      if (statusData.status === "LOST") {
        lostClients = statusData._count.status || 0;
      }
      if (statusData.status === "LEAD") {
        leadsClients = statusData._count.status || 0;
      }
    });

    // Calculate total number of clients (leads + active + lost)
    const totalClients = activeClients + lostClients + leadsClients;

    // Calculate closing rate (active / (active + lost))
    const closingRate =
      totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0;

    return {
      totalClients,
      activeClients,
      lostClients,
      leadsClients, // Return leads count
      closingRate,
    };
  }
}

export default KpiManager;
