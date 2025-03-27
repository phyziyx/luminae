import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/admin-sidebar";
import UserManager from "@/lib/managers/userManager";
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

  const isAdmin = await UserManager.isAdmin(user.id);

  if (!isAdmin) {
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
