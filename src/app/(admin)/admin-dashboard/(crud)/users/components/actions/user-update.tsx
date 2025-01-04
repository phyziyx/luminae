"use server";

import { z } from "zod";
import formSchema from "../user-details/schema";
import UserManager from "@/lib/managers/userManager";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const onUserUpdate = async (values: z.infer<typeof formSchema>) => {
  const user = await currentUser();

  let error = "An error occurred while updating the user.";

  if (!user) {
    console.error("An unauthenticated user attempted to update user details.");
    return { error };
  }

  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  const userId = validatedFields.data.id;
  if (!userId) {
    error = "User ID is required.";
    return { error };
  }

  const userFields = validatedFields.data;

  const isAdmin = await UserManager.isAdmin(user.id);

  if (!isAdmin) {
    error = "User is not an admin.";
    return { error };
  }

  try {
    await UserManager.updateUser(userId, {
      firstName: userFields.firstName,
      lastName: userFields.lastName,
      email: userFields.email,
      avatarUrl: userFields.avatarUrl || "",
    });

    const clerk = await clerkClient();

    await clerk.users.updateUser(userId, {
      firstName: userFields.firstName,
      lastName: userFields.lastName,
    });

    error = "";
  } catch (err) {
    error = "An error occurred while attempting to update the user.";
    console.error(err);
  }

  // Revalidate the cache
  revalidatePath("/dashboard", "page");

  return {
    error,
  };
};

export default onUserUpdate;
