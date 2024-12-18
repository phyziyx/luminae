"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { AgencyData, columns } from "./components/columns";
import AgencyManager from "@/lib/managers/agencyManager";
import prisma from "@/lib/db";
import { getTranslations } from "next-intl/server";

const t = await getTranslations({ locale: "en" });

// Fetch agencies based on agencyId
const fetchAgencies = async (agencyId: string): Promise<AgencyData[]> => {
  const agencies = await prisma.agency.findMany({
    where: { id: agencyId },  // Use `id` for the agency ID in query
    include: {
      agencyMembers: true,  // Optional: include associated members if needed
    },
  });

  // Map agency data for the DataTable
  return agencies.map((agency) => ({
    id: agency.id,
    name: agency.name,
    status: "Active",  // Example: You can add dynamic status logic here if needed
    logo: agency.agencyLogo,  // Include other fields as required
    email: agency.companyEmail,  // Example of additional data to display
  }));
};

const AgencyPage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  const email = user.emailAddresses[0].emailAddress;
  const agencyMember = await prisma.agencyMember.findUnique({
    where: { email },
    include: { agency: true },
  });

  if (!agencyMember || !agencyMember.agencyId) {
    return <div>{t("ERROR_MESSAGES.NOT_PART_OF_AGENCY")}</div>;
  }

  // Fetch agencies based on the agencyId from the agencyMember
  const data = await fetchAgencies(agencyMember.agencyId);

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">Agencies</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default AgencyPage;