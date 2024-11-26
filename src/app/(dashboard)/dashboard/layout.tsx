import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/sidebar";
import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser, auth } from "@clerk/nextjs/server";
import AgencyDetails from "../components/agency-details/agency-details";
import Logo from "@/components/logo";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();

  if (!user) {
    redirectToSignIn();
    return;
  }

  const email = user.emailAddresses[0].emailAddress;
  const agencyMember = await AgencyManager.findUserAgency(email);

  if (!agencyMember) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Logo className="text-blue-500 max-w-sm" />
        <div className="w-full max-w-2xl p-6">
          <AgencyDetails data={{ companyEmail: email }} />
        </div>
      </div>
    );
  }

  let workspaces = await AgencyManager.findWorkspaces(agencyMember.agencyId);

  if (
    agencyMember.role === "AGENCY_ADMIN" ||
    agencyMember.role === "AGENCY_OWNER"
  ) {
    // No need to filter workspaces
  } else {
    workspaces = workspaces.filter((workspace) =>
      agencyMember.Permissions.some(
        (permission) => permission.workspaceId === workspace.id
      )
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-mobile": "18rem",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar
        role={agencyMember.role}
        agency={agencyMember.agency}
        workspaces={workspaces}
      >
        {children}
      </DashboardSidebar>
    </SidebarProvider>
  );
};

export default DashboardLayout;
