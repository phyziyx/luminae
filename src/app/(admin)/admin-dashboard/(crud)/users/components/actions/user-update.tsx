"use server";

import { z } from "zod";
import formSchema from "../user-details/schema";
import UserManager from "@/lib/managers/userManager";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const onUserUpdate = async (values: z.infer<typeof formSchema>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

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
    // TODO: Update the user
    console.log(userFields);

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
