"use server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import AgencyDetails from "../../components/agency-details/agency-details";
import AgencyManager from "@/lib/managers/agencyManager";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Settings = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const t = await getTranslations();

  if (!user) {
    return <div>Not authenticated!</div>;
  }

  const agencyMember = await AgencyManager.findUserAgency(user.email);
  const email = user.email;
  const agency = agencyMember?.agency;

  if (!agency) {
    return <div>Agency not found!</div>;
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">{t("SETTINGS")}</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* TODO: Implement a better design for this page */}
        <AgencyDetails
          data={{
            id: agency.id,
            name: agency.name,
            address: agency.address,
            agencyLogo: agency.agencyLogo,
            city: agency.city,
            companyPhone: agency.companyPhone,
            country: agency.country,
            createdAt: agency.createdAt,
            state: agency.state,
            updatedAt: agency.updatedAt,
            zipCode: agency.zipCode,
            companyEmail: email,
          }}
        />
      </div>
    </>
  );
};

export default Settings;
