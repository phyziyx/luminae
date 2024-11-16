"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import AgencyManager from "@/lib/managers/agencyManager";
import WorkspaceCard from "./components/workspace-card";
import CreateWorkspaceCard from "./components/create-workspace-card";

const Workspaces = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  const t = await getTranslations();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  const email = user.emailAddresses[0].emailAddress;
  const workspaces = await AgencyManager.findAndFilterWorkspaces(email);

  // workspaces = [
  //   {
  //     agencyId: "1",
  //     id: "1",
  //     name: "SEO Workspace",
  //     description: "This is the workspace for SEO tasks.",
  //     createdAt: new Date("2021-09-01T00:00:00.000Z"),
  //     updatedAt: new Date("2021-09-01T00:00:00.000Z"),
  //   },
  //   {
  //     agencyId: "1",
  //     id: "2",
  //     name: "Web Design Workspace",
  //     description: "Web design workspace for the agency.",
  //     createdAt: new Date("2021-10-01T00:00:00.000Z"),
  //     updatedAt: new Date("2021-10-01T00:00:00.000Z"),
  //   },
  //   {
  //     agencyId: "1",
  //     id: "3",
  //     name: "Graphic Design",
  //     description: "Web design workspace for the agency.",
  //     createdAt: new Date("2021-10-01T00:00:00.000Z"),
  //     updatedAt: new Date("2021-10-01T00:00:00.000Z"),
  //   },
  //   {
  //     id: "4",
  //     name: "App Development",
  //     description: "This is the workspace for App Development",
  //     createdAt: new Date("2024-10-01T00:00:00.000Z"),
  //     updatedAt: new Date("2024-10-01T00:00:00.000Z"),
  //     agencyId: "1",
  //   },
  //   {
  //     id: "5",
  //     name: "Digital Marketing",
  //     description: "This is the workspace for Digital Marketing",
  //     createdAt: new Date("2024-10-01T00:00:00.000Z"),
  //     updatedAt: new Date("2024-10-01T00:00:00.000Z"),
  //     agencyId: "1",
  //   },
  // ];

  const created = workspaces.length;
  const max = 5;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">{t("WORKSPACES")}</h1>
        </div>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 pt-0">
        {workspaces &&
          workspaces.length > 0 &&
          workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        <CreateWorkspaceCard created={created} max={max} />
      </div>
    </>
  );
};

export default Workspaces;
