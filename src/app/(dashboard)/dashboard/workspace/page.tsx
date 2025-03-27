"use server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import AgencyManager from "@/lib/managers/agencyManager";
import WorkspaceCard from "./components/workspace-card";
import CreateWorkspaceCard from "./components/create-workspace-card";
import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";
import { isAgencyAdmin } from "@/lib/utils";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

const WorkspacesList = async ({ userEmail }: { userEmail: string }) => {
  const agencyMember = await AgencyManager.findUserAgency(userEmail);

  if (!agencyMember) {
    return <div>You are not a member of any agency.</div>;
  }

  // Total workspaces created in the agency
  const workspacesCount = await AgencyManager.findWorkspacesCount(
    agencyMember.agencyId
  );

  // Workspaces filtered for the user
  const workspaces = await AgencyManager.findAndFilterWorkspaces(userEmail);

  const t = await getTranslations();

  const max =
    (await AgencyManager.getFeatureMaxCount(
      agencyMember.agencyId,
      "WORKSPACE"
    )) || -1;

  if (!isAgencyAdmin(agencyMember.role) && workspacesCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        {t("NO_WORKSPACES_ASSIGNED")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 pt-0">
      {workspaces &&
        workspaces.length > 0 &&
        workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            isAdmin={isAgencyAdmin(agencyMember.role)}
          />
        ))}

      {isAgencyAdmin(agencyMember.role) && (
        <CreateWorkspaceCard created={workspacesCount} max={max} />
      )}
    </div>
  );
};

const Workspaces = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const t = await getTranslations();

  if (!user) {
    return <div>Not authenticated!</div>;
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">{t("WORKSPACES")}</h1>
        </div>
      </header>
      <Suspense fallback={<FallbackSpinner />}>
        <WorkspacesList userEmail={user.email} />
      </Suspense>
    </>
  );
};

export default Workspaces;
