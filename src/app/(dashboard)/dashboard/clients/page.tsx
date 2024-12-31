"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { DataTable } from "./components/data-table";
// import { TeamMember, columns } from "./components/columns";
import AgencyManager from "@/lib/managers/agencyManager";
import { getTranslations } from "next-intl/server";

import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";

const t = await getTranslations({ locale: "en" });

const ClientsList = async ({ agencyId }: { agencyId: string }) => {
  const clients = await AgencyManager.findClients(agencyId);

  //   const data: TeamMember[] = members.map((member) => ({
  //     id: member.id,
  //     name: member.user.name,
  //     email: member.email,
  //     role: member.role,
  //     status: "Active",
  //   }));

  // <DataTable columns={columns} data={data} />;
  return (
    <>
      {clients.map((client) => (
        <div key={client.id}>{client.name}</div>
      ))}
    </>
  );
};

const Clients = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  const email = user.emailAddresses[0].emailAddress;
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
