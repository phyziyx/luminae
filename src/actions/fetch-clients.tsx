"use server";

import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser } from "@clerk/nextjs/server";

export default async function fetchClients() {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const member = await AgencyManager.findUserAgency(
    user.emailAddresses[0].emailAddress
  );

  if (!member) {
    return [];
  }

  const clients = await AgencyManager.findClients(member.agencyId);

  return clients;
}
