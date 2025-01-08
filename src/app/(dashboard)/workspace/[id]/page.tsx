"use server";

import FallbackSpinner from "@/components/site/fallback-spinner";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import KanbanBoard from "./components/kanban-board";

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

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">{t("WORKSPACE")}</h1>
        </div>
      </header>
      <Suspense fallback={<FallbackSpinner />}>
        <KanbanBoard id={"1"} name={"dummy"} />
      </Suspense>
    </>
  );
}
