"use server";

import prisma from "@/lib/db";

export const fetchAgencyDetails = async (agencyId: string) => {
  const agency = await prisma.agency.findUnique({
    where: { id: agencyId },
  });

  if (!agency) {
    throw new Error("Agency not found");
  }

  return {
    id: agency.id,
    name: agency.name,
    agencyLogo: agency.agencyLogo || "",
    companyEmail: agency.companyEmail || "",
    companyPhone: agency.companyPhone || "",
    stripeCustomerId: agency.stripeCustomerId || "",
    address: agency.address || "",
    city: agency.city || "",
    zipCode: agency.zipCode || "",
    state: agency.state || "",
    country: agency.country || "",
  };
};