"use server";

import PackageManager from "@/lib/managers/packageManager";
import { currentUser } from "@clerk/nextjs/server";

const fetchPackageDetails = async (packageId: string) => {
  const user = await currentUser();

  if (!user) {
    console.error("Unauthenticated user tried to fetch package details.");
    throw new Error("User not authenticated.");
  }

  try {
    const packageDetails = await PackageManager.getPackageById(packageId);
    return packageDetails;
  } catch (error) {
    console.error("Failed to fetch package details:", error);
    throw new Error("Failed to fetch package details.");
  }
};

export default fetchPackageDetails;