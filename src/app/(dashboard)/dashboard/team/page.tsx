"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { TeamMember, columns } from "./components/columns";
import AgencyManager from "@/lib/managers/agencyManager";

const data: TeamMember[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "AGENCY_ADMIN",
    workspacesAssigned: 3,
    status: "Active",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "AGENCY_OWNER",
    workspacesAssigned: 5,
    status: "On Break",
  },
  {
    id: "3",
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "AGENCY_USER",
    workspacesAssigned: 2,
    status: "Removed",
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "AGENCY_USER",
    workspacesAssigned: 4,
    status: "Active",
  },

  {
    id: "5",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "AGENCY_ADMIN",
    workspacesAssigned: 3,
    status: "Active",
  },
  {
    id: "6",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "AGENCY_USER",
    workspacesAssigned: 5,
    status: "On Break",
  },
  {
    id: "7",
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "AGENCY_ADMIN",
    workspacesAssigned: 2,
    status: "Removed",
  },
  {
    id: "8",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "AGENCY_USER",
    workspacesAssigned: 4,
    status: "Active",
  },

  {
    id: "9",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "AGENCY_ADMIN",
    workspacesAssigned: 3,
    status: "Active",
  },
  {
    id: "10",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "AGENCY_USER",
    workspacesAssigned: 5,
    status: "On Break",
  },
  {
    id: "11",
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "AGENCY_ADMIN",
    workspacesAssigned: 2,
    status: "Removed",
  },
  {
    id: "12",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "AGENCY_USER",
    workspacesAssigned: 4,
    status: "Active",
  },

  {
    id: "13",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "AGENCY_ADMIN",
    workspacesAssigned: 3,
    status: "Active",
  },
  {
    id: "14",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "AGENCY_USER",
    workspacesAssigned: 5,
    status: "On Break",
  },
  {
    id: "15",
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "AGENCY_ADMIN",
    workspacesAssigned: 2,
    status: "Removed",
  },
  {
    id: "16",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "AGENCY_USER",
    workspacesAssigned: 4,
    status: "Active",
  },
];

const Team = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  const email = user.emailAddresses[0].emailAddress;
  const agencyMember = await AgencyManager.findUserAgency(email);

  if (!agencyMember) {
    return <div>Not part of an agency!</div>;
  }

  const members = await AgencyManager.findAgencyMembers(agencyMember?.agencyId);
  const data = members.map((member) => ({
    id: member.id,
    name: "to-do",
    email: member.email,
    role: member.role,
    status: "ACTIVE",
  }));

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
