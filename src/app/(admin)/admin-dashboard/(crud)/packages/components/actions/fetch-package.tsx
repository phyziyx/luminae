"use server";

import { auth } from "@/lib/auth/auth";
import PackageManager from "@/lib/managers/packageManager";
import { headers } from "next/headers";

const fetchPackageDetails = async (packageId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

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
