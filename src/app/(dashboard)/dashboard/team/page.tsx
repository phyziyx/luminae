"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import { DataTable } from "./components/data-table";
import { Payment, columns } from "./components/columns";

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "invited",
    email: "new@gmail.com",
    role: "member",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "member",
    email: "member@gmail.com",
    role: "admin",
  },
];

const Team = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  const t = await getTranslations();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">{t("TEAM")}</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default Team;
