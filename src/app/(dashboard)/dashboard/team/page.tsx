"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { TeamMember, columns } from "./components/columns";

const data: TeamMember[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Agency Admin", workspacesAssigned: 3, status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Team Member", workspacesAssigned: 5, status: "On Break" },
  { id: "3", name: "Charlie Davis", email: "charlie@example.com", role: "Agency Admin", workspacesAssigned: 2, status: "Removed" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Team Member", workspacesAssigned: 4, status: "Active" },
  // Add more dummy data as needed
];

const Team = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">Team Members</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default Team;