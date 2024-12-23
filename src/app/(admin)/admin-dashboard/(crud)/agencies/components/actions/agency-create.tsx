"use server";

import { z } from "zod";
import formSchema from "@/app/(dashboard)/components/agency-details/schema";
import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import UserManager from "@/lib/managers/userManager";

const onAgencyCreate = async (values: z.infer<typeof formSchema>) => {
  const user = await currentUser();

  let error = "An error occurred while creating the agency.";

  if (!user) {
    console.error("A user who is not authenticated tried to create an agency.");
    return { error };
  }

  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  const agencyFields = validatedFields.data;

  const isAdmin = await UserManager.isUserAdmin(user.id);

  if (!isAdmin) {
    error = "User is not an admin.";
    return { error };
  }

  try {
    await AgencyManager.createAgency({
      address: agencyFields.address,
      city: agencyFields.city,
      country: agencyFields.country,
      name: agencyFields.name,
      state: agencyFields.state,
      zipCode: agencyFields.zipCode,
      companyEmail: agencyFields.companyEmail,
      companyPhone: agencyFields.companyPhone,
      agencyLogo: agencyFields.agencyLogo || "",
    });
    error = "";
  } catch (err) {
    error = "An error occurred while attempting to create the agency.";
    console.error(err);
  }

  // Revalidate the cache
  revalidatePath("/dashboard", "page");

  return {
    error,
  };
};

export default onAgencyCreate;