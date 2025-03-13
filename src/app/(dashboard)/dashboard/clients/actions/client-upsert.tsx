"use server";

import { z } from "zod";

import { revalidatePath } from "next/cache";
import formSchema from "../client-details/schema";
import ClientManager from "@/lib/managers/clientManager";
import AgencyManager from "@/lib/managers/agencyManager";
import { isAgencyAdmin } from "@/lib/utils";
import { v7 } from "uuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const onClientUpsert = async (values: z.infer<typeof formSchema>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  let error = "An error occurred while updating or creating a client.";

  if (!user) {
    console.error(
      "A user who is not authenticated tried to update or create clients."
    );
    return { error };
  }

  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  const clientID = validatedFields.data.id || v7();
  if (!clientID) {
    error = "Client ID is required.";
    return { error };
  }

  const agencyMember = await AgencyManager.findUserAgency(user.email);

  if (!agencyMember) {
    error = "User is not a member of an agency.";
    return { error };
  }

  if (!isAgencyAdmin(agencyMember.role)) {
    return { error: "User is not authorized." };
  }

  const clientFields = validatedFields.data;

  try {
    await ClientManager.upsertClient(
      {
        id: clientID,
        name: clientFields.name,
        email: clientFields.email,
        phone: clientFields.phone,
        city: clientFields.city,
        state: clientFields.state,
        country: clientFields.country,
        status: clientFields.status,
      },
      agencyMember.agencyId
    );
    error = "";
  } catch (err) {
    error = "An error occurred while attempting to update the client.";
    console.error(err);
  }

  // Revalidate the cache
  revalidatePath("/dashboard/clients");

  return { error };
};

export default onClientUpsert;
