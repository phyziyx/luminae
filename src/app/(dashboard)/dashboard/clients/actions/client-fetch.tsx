"use server";

import ClientManager from "@/lib/managers/clientManager";
import { currentUser } from "@clerk/nextjs/server";

const fetchClientDetails = async (clientId: string) => {
  // Ensure the user is authenticated
  const user = await currentUser();

  if (!user) {
    console.error("Unauthenticated user tried to fetch client details.");
    throw new Error("User not authenticated.");
  }

  // Fetch client details
  try {
    const clientDetails = await ClientManager.fetchClientDetails(clientId);
    return clientDetails;
  } catch (error) {
    console.error("Failed to fetch client details:", error);
    throw new Error("Failed to fetch client details.");
  }
};

export default fetchClientDetails;
