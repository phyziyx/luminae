"use server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";
import UserManager from "@/lib/managers/userManager";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

const t = await getTranslations({ locale: "en" });

const UsersList = async () => {
  // Fetch user data for the DataTable
  const users = await UserManager.fetchUsers();

  return (
    <DataTable
      columns={columns}
      data={users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.agencyMember?.role || "N/A", // Role if part of an agency
        status: "Active",
        isLocked: !!user.banned,
      }))}
    />
  );
};

const UserPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">{t("USERS")}</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<FallbackSpinner />}>
          <UsersList />
        </Suspense>
      </div>
    </>
  );
};

export default UserPage;
