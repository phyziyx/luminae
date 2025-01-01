"use server";

import UserManager from "@/lib/managers/userManager";
import { currentUser } from "@clerk/nextjs/server";

const fetchUserDetails = async (userId: string) => {
  // Ensure the user is authenticated
  const user = await currentUser();

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
