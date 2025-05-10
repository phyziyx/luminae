"use server";

import prisma from "@/lib/db";
import {
  invitationRegistrationSchema,
  InvitationRegistrationSchema,
} from "@/lib/forms";
import UserManager from "@/lib/managers/userManager";
import { revalidatePath } from "next/cache";

export default async function onAcceptInvite(
  values: InvitationRegistrationSchema
) {
  let error = "An error occurred while accepting the invitation";

  const validatedFields = invitationRegistrationSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  const { name, password, invitationId } = validatedFields.data;

  try {
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
      error = "Invitation not found";

      return { error };
    }

    await UserManager.createUser({
      email: invitation.email,
      image: "",
      name,
      password,
    });

    error = "";
  } catch (err) {
    error = "An error occurred while accepting the invitation";
    console.error(err);
  }

  // revalidate the cache
  revalidatePath("/");

  return {
    error,
  };
}
