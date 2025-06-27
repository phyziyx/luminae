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
  const validatedFields = invitationRegistrationSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const { name, password, invitationId } = validatedFields.data;

  try {
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
      return { error: "Invitation not found" };
    }

    await UserManager.createUser({
      email: invitation.email,
      image: "",
      name,
      password,
    });
  } catch (err) {
    return { error: "An error occurred while accepting the invitation." };
  }

  // revalidate the cache
  revalidatePath("/");

  return {
    error: null,
  };
}
