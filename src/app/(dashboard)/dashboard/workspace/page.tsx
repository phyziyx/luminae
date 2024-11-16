"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import AgencyManager from "@/lib/managers/agencyManager";

const Workspaces = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  const t = await getTranslations();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  const email = user.emailAddresses[0].emailAddress;
  const workspaces = await AgencyManager.findAndFilterWorkspaces(email);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">{t("WORKSPACES")}</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* TODO: Add a data table */}
        {workspaces && workspaces.length > 0
          ? workspaces.map((workspace) => (
              <div key={workspace.id} className="flex items-center gap-2">
                <div>{workspace.name}</div>
                <div>{workspace.id}</div>
              </div>
            ))
          : t("NO_WORKSPACES_FOUND")}
      </div>
    </>
  );
};

export default Workspaces;
