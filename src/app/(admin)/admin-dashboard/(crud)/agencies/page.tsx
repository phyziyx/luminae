"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { AgencyData, columns } from "./components/columns";
import prisma from "@/lib/db";
import { getTranslations } from "next-intl/server";

const t = await getTranslations({ locale: "en" });

// Fetch agencies, including those with no members
const fetchAgencies = async (): Promise<AgencyData[]> => {
  const agencies = await prisma.agency.findMany({
    include: {
      agencyMembers: true, // Include members, even if there are none
    },
  });

  // Map agency data for the DataTable
  return agencies.map((agency) => ({
    id: agency.id,
    name: agency.name,
    status: agency.agencyMembers.length > 0 ? "Active" : "No Members", // Adjust status based on membership
    logo: agency.agencyLogo, // Include other fields as required
    email: agency.companyEmail, // Example of additional data to display
  }));
};

const AgencyPage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  // Fetch all agencies
  const data = await fetchAgencies();

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">{t("AGENCIES")}</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default AgencyPage;
