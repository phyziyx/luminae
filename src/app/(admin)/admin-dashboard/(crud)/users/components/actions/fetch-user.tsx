"use server";

import { auth } from "@/lib/auth";
import UserManager from "@/lib/managers/userManager";
import { headers } from "next/headers";

const fetchUserDetails = async (userId: string) => {
  // Ensure the user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
