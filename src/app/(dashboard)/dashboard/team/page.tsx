"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { TeamMember, columns } from "./components/columns";
import AgencyManager from "@/lib/managers/agencyManager";
import { getTranslations } from "next-intl/server";

import { Suspense } from "react";

const t = await getTranslations({ locale: "en" });

const Team = async () => {
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

  const members = await AgencyManager.findAgencyMembers(agencyMember?.agencyId);
  const data: TeamMember[] = members.map((member) => ({
    id: member.id,
    name: "to-do",
    email: member.email,
    role: member.role,
    status: "Active",
  }));

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">
          {t("INVITE_TEAM_MEMBER.TEAM_MEMBER")}
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable columns={columns} data={data} />
        </Suspense>
      </div>
    </>
  );
};

export default Team;
