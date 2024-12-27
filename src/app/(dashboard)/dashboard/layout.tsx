import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/sidebar";
import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser, auth } from "@clerk/nextjs/server";
import AgencyDetails from "../components/agency-details/agency-details";
import Logo from "@/components/logo";
import UserManager from "@/lib/managers/userManager";
import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();

  if (!user) {
    redirectToSignIn();
    return;
  }

  const email = user.emailAddresses[0].emailAddress;

  const foundUser = UserManager.findUser(email);
  if (!foundUser) {
    // User not found, lets create an account...
    await UserManager.createUser({
      id: user.id,
      email: email,
      name: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.imageUrl,
    });
  }

  // TODO: Check if user is an admin, and redirect

  // const isAdmin = true;
  // if (isAdmin){
  //   redirect("/admin-dashboard");
  // }

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

  const workspaces = await AgencyManager.findAndFilterWorkspaces(
    agencyMember.email
  );

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
        <Suspense fallback={<FallbackSpinner />}>{children}</Suspense>
      </DashboardSidebar>
    </SidebarProvider>
  );
};

export default DashboardLayout;
