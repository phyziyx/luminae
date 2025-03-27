"use server";

import { z } from "zod";
import formSchema from "./schema";
import AgencyManager from "@/lib/managers/agencyManager";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    console.error("A user who is not authenticated tried to create an agency.");
    return;
  }

  const agencyId = values.id;

  try {
    console.log(values);

    if (agencyId) {
      // Update agency

      const agency = await AgencyManager.updateAgency({
        id: agencyId,
        name: values.name,
        address: values.address,
        agencyLogo: values.agencyLogo || "",
        state: values.state,
        zipCode: values.zipCode,
        city: values.city,
        country: values.country,
        companyEmail: values.companyEmail,
        companyPhone: values.companyPhone,
      });

      if (!agency) {
        console.log("Failed to update agency");
        return;
      }
    } else {
      // Create agency

      const agency = await AgencyManager.createAgency(
        {
          name: values.name,
          address: values.address,
          agencyLogo: values.agencyLogo || "",
          state: values.state,
          zipCode: values.zipCode,
          city: values.city,
          country: values.country,
          companyEmail: values.companyEmail,
          companyPhone: values.companyPhone,
        },
        user.email
      );

      if (!agency) {
        console.log("Failed to create agency");
        return;
      }
    }

    // toast({
    //   variant: "default",
    //   title: t("SUCCESS"),
    //   description: t("AGENCY_DETAILS.AGENCY_CREATED_SUCCESSFULLY"),
    // });

    revalidatePath("/dashboard", "page");
  } catch (err) {
    console.log(err);

    // toast({
    //   variant: "destructive",
    //   title: {t("ERROR_MESSAGES.AN_ERROR_OCCURRED")},
    //   description: t("AGENCY_DETAILS.FAILED_TO_CREATE_AGENCY"),
    // });
  }
};

export default onSubmit;
