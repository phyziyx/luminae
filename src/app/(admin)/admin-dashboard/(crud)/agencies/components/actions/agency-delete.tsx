"use server";

import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import AgencyManager from "@/lib/managers/agencyManager";
import { revalidatePath } from "next/cache";
import UserManager from "@/lib/managers/userManager";

// Zod schema for agency deletion, expecting only the agency ID
const deleteAgencySchema = z.object({
  id: z.string().min(1, "Agency ID is required"),
});

const deleteAgency = async (values: z.infer<typeof deleteAgencySchema>) => {
  const user = await currentUser();

  let error = "An error occurred while deleting the agency.";

  // Check if the user is authenticated
  if (!user) {
    console.error("An unauthenticated user attempted to delete an agency.");
    return { error };
  }

  // Validate the provided agency ID using the schema
  const validatedFields = deleteAgencySchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid agency ID provided.";
    return { error };
  }

  const agencyID = validatedFields.data.id;

  // Check if the current user is an admin
  const isAdmin = await UserManager.isAdmin(user.id);

  if (!isAdmin) {
    error = "User is not authorized to delete agencies.";
    return { error };
  }

  try {
    // Perform the deletion
    await AgencyManager.deleteAgency(agencyID);
    error = "";
  } catch (err) {
    error = "An error occurred while attempting to delete the agency.";
    console.error(err);
  }

  // Revalidate the cache for the agencies list page
  revalidatePath("/agencies");

  return {
    error,
  };
};

export default deleteAgency;
