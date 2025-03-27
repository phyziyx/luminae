"use server";

import { auth } from "@/lib/auth/auth";
import AgencyManager from "@/lib/managers/agencyManager";
import { headers } from "next/headers";

export default async function fetchClients() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return [];
  }

  const member = await AgencyManager.findUserAgency(user.email);

  if (!member) {
    return [];
  }

  const clients = await AgencyManager.findClients(member.agencyId);

  return clients;
}
