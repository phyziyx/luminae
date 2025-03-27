"use server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { DataTable } from "./components/data-table";
// import { TeamMember, columns } from "./components/columns";
import ClientManager from "@/lib/managers/clientManager";
import AgencyManager from "@/lib/managers/agencyManager";
import { getTranslations } from "next-intl/server";

import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

const t = await getTranslations({ locale: "en" });

const ClientsList = async ({ agencyId }: { agencyId: string }) => {
  const clients = await ClientManager.fetchClients(agencyId);
  return (
    <DataTable
      columns={columns}
      data={clients.map((client) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        city: client.city,
        state: client.state,
        country: client.country,
        ticketSize: client.ticketSize,
        status: client.status,
      }))}
    />
  );
};

const Clients = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  const email = user.email;
  const agencyMember = await AgencyManager.findUserAgency(email);

  if (!agencyMember) {
    return <div>{t("ERROR_MESSAGES.NOT_PART_OF_AGENCY")}</div>;
  }

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">{t("CLIENTS.HEADER")}</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<FallbackSpinner />}>
          <ClientsList agencyId={agencyMember.agencyId} />
        </Suspense>
      </div>
    </>
  );
};

export default Clients;
