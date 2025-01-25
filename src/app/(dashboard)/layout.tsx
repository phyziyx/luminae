import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./components/sidebar";
import AgencyManager from "@/lib/managers/agencyManager";
import { currentUser, auth } from "@clerk/nextjs/server";
import UserManager from "@/lib/managers/userManager";
import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();

  if (!user) {
    redirectToSignIn();
    return;
  }

  const email = user.emailAddresses[0].emailAddress;

  const foundUser = await UserManager.findUser(email);
  if (!foundUser) {
    // User not found, lets create an account...
    await UserManager.createUser({
      id: user.id,
      email: email,
      firstName: user.firstName!,
      lastName: user.lastName!,
      avatarUrl: user.imageUrl,
    });
  }

  const isAdmin = await UserManager.isAdmin(user.id);
  if (isAdmin) {
    redirect("/admin-dashboard");
  }

  const agencyMember = await AgencyManager.findUserAgency(email);

  if (!agencyMember) {
    redirect("/onboarding");
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
          boxSizing: "border-box",
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
