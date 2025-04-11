"use server";

import { getSession } from "@/lib/auth/auth";
import AgencyManager from "@/lib/managers/agencyManager";

const fetchAgencyDetails = async (agencyId: string) => {
  // Ensure the user is authenticated
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    console.error("Unauthenticated user tried to fetch agency details.");
    throw new Error("User not authenticated.");
  }

  // Fetch agency details
  try {
    const agencyDetails = await AgencyManager.fetchAgencyDetails(agencyId);
    return agencyDetails;
  } catch (error) {
    console.error("Failed to fetch agency details:", error);
    throw new Error("Failed to fetch agency details.");
  }
};

export default fetchAgencyDetails;
