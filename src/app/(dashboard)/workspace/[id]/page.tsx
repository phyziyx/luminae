"use server";

import FallbackSpinner from "@/components/site/fallback-spinner";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import AgencyManager from "@/lib/managers/agencyManager";
import { KanbanProvider } from "@/components/kanban/kanban-provider";
import KanbanNew from "@/components/test";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const t = await getTranslations();
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  const workspace = await AgencyManager.findWorkspace(id);

  if (!workspace) {
    return <div>Workspace not found!</div>;
  }

  return (
    <div className="h-full flex flex-col box-border">
      {/* Header */}
      <header className="box-border flex h-16 shrink-0 items-center gap-2">
        <div className="h-full box-border flex flex-row gap-2 px-4 items-center w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">{`${t("WORKSPACE")}: ${
            workspace.name
          }`}</h1>
        </div>
      </header>

      {/* Content */}

      <Suspense fallback={<FallbackSpinner />}>
        <KanbanNew />
      </Suspense>
    </div>
  );
}
