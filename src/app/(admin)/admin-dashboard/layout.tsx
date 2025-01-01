import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/admin-sidebar";
import { currentUser, auth } from "@clerk/nextjs/server";
import UserManager from "@/lib/managers/userManager";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();

  if (!user) {
    redirectToSignIn();
    return;
  }

  if (!(await UserManager.isAdmin(user.id))) {
    redirect("/dashboard");
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
      <DashboardSidebar>{children}</DashboardSidebar>
    </SidebarProvider>
  );
};

export default DashboardLayout;
