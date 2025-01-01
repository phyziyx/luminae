"use server";

import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import UserManager from "@/lib/managers/userManager";
import { revalidatePath } from "next/cache";

// Zod schema for the user deletion, expecting only the user ID
const deleteUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

const onUserDelete = async (values: z.infer<typeof deleteUserSchema>) => {
  const user = await currentUser();

  let error = "An error occurred while deleting the user.";

  // Check if the user is authenticated
  if (!user) {
    console.error("An unauthenticated user attempted to delete a user.");
    return { error };
  }

  // Validate the provided user ID using the schema
  const validatedFields = deleteUserSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid user ID provided.";
    return { error };
  }

  const userID = validatedFields.data.id;

  // Check if the current user is an admin
  const isAdmin = await UserManager.isAdmin(user.id);

  if (!isAdmin) {
    error = "User is not an admin.";
    return { error };
  }

  try {
    // Perform the deletion
    await UserManager.deleteUser(userID);
    error = "";
  } catch (err) {
    error = "An error occurred while attempting to delete the user.";
    console.error(err);
  }

  // Revalidate the cache (you may want to update this depending on your use case)
  revalidatePath("/dashboard", "page");

  return {
    error,
  };
};

export default onUserDelete;
