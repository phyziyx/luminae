"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { DataTable } from "./components/data-table";
// import { UserData, columns } from "./components/columns";
// import prisma from "@/lib/db";
import { getTranslations } from "next-intl/server";
import PackageManager from "@/lib/managers/packageManager";
import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";

const t = await getTranslations({ locale: "en" });

const PackagesList = async () => {
  const packages = await PackageManager.getPackages();

  return (
    <div>
      {packages.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
};

export default async function PackagesPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">Packages</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<FallbackSpinner />}>
          <PackagesList />
        </Suspense>
      </div>
    </>
  );
}
