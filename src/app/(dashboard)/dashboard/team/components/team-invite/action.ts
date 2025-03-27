"use server";

import { z } from "zod";
import formSchema from "./schema";
import AgencyManager from "@/lib/managers/agencyManager";

import { revalidatePath } from "next/cache";
import UserManager from "@/lib/managers/userManager";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

const onCreateInvite = async (values: z.infer<typeof formSchema>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  let error = "An error occurred while sending an invite.";

  if (!user) {
    console.error("A user who is not authenticated tried to invite a member.");
    return;
  }

  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  const { email, role } = validatedFields.data;

  const agency = await AgencyManager.findUserAgency(user.email);

  if (!agency) {
    error = "User does not have an agency.";
    return { error };
  }

  try {
    const invitation = await AgencyManager.isInvitationCreated(email);

    if (invitation) {
      error = "An invitation has already been sent to this email address.";
      return { error };
    }

    if (["AGENCY_USER", "AGENCY_ADMIN"].indexOf(role) === -1) {
      error = "Invalid role provided.";
      return { error };
    }

    const invitedUser = await UserManager.findUser(email);
    if (invitedUser) {
      error = "User already exists.";
      return { error };
    }

    try {
      await AgencyManager.createInvitation(email, agency.agencyId, role);
      error = "";
    } catch (err: unknown) {
      error =
        err && err instanceof Error
          ? err.message
          : "An error occurred while creating the invitation.";
    }
    return { error };
  } catch (err) {
    error =
      "An error occurred while attempting to create or update the workspace.";
    console.error(err);
  }

  // Revalidate the cache
  revalidatePath("/dashboard", "page");

  return {
    error,
  };
};

export default onCreateInvite;
