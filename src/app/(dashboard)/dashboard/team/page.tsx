"use server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { TeamMember, columns } from "./components/columns";
import AgencyManager from "@/lib/managers/agencyManager";
import { getTranslations } from "next-intl/server";

import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

const t = await getTranslations({ locale: "en" });

const TeamList = async ({ agencyId }: { agencyId: string }) => {
  const members = await AgencyManager.findAgencyMembers(agencyId);
  const data: TeamMember[] = members.map((member) => ({
    id: member.id,
    name: member.user.name,
    email: member.email,
    role: member.role,
    status: "Active",
  }));

  return <DataTable columns={columns} data={data} />;
};

const Team = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  const { email } = user;
  const agencyMember = await AgencyManager.findUserAgency(email);

  if (!agencyMember) {
    return <div>{t("ERROR_MESSAGES.NOT_PART_OF_AGENCY")}</div>;
  }

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
        <Suspense fallback={<FallbackSpinner />}>
          <TeamList agencyId={agencyMember.agencyId} />
        </Suspense>
      </div>
    </>
  );
};

export default Team;
