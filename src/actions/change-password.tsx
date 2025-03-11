"use server";

import { auth } from "@/lib/auth";
import { changePasswordSchema, ChangePasswordSchema } from "@/lib/forms";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export default async function onPasswordUpdate(values: ChangePasswordSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  let error = "An error occurred while saving the workspace information";

  if (!user) {
    error = "A user who is not authenticated tried to create a lane.";
    return { error };
  }

  const validatedFields = changePasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
    });

    error = "";
  } catch (err) {
    error = "An error occurred while attempting to create a lane.";
    console.error(err);
  }

  // Revalidate the cache
  revalidatePath("/");

  return {
    error,
  };
}
