"use server";

import { getSession } from "@/lib/auth/auth";
import UserManager from "@/lib/managers/userManager";

const fetchUserDetails = async (userId: string) => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    console.error("Unauthenticated user tried to fetch user details.");
    throw new Error("User not authenticated.");
  }

  // Fetch user details
  try {
    const userDetails = await UserManager.findUser(userId);
    return userDetails;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw new Error("Failed to fetch user details.");
  }
};

export default fetchUserDetails;
