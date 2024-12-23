"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { UserData, columns } from "./components/columns";
import prisma from "@/lib/db";
import { getTranslations } from "next-intl/server";

const t = await getTranslations({ locale: "en" });

// Fetch users
const fetchUsers = async (): Promise<UserData[]> => {
    const users = await prisma.user.findMany({
      include: {
        AgencyMembers: true,
        Notification: true,
      },
    });
  
    // Map user data for the DataTable, including the 'status' field
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.AgencyMembers?.role || "N/A", // Role if part of an agency
      status: "active", // Example: add default status (if applicable)
    }));
  };
  

const UserPage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  // Fetch user data for the DataTable
  const data = await fetchUsers();

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">Users</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default UserPage;