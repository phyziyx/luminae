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
        });
        return clients;
    }

    
}

export default ClientManager;