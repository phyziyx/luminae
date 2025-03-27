import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./components/sidebar";
import AgencyManager from "@/lib/managers/agencyManager";
import UserManager from "@/lib/managers/userManager";
import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return;
  }

  const { email } = user;

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
