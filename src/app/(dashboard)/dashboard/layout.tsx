import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // TODO: Uncomment this code block if you want to check if the user is authenticated
  // const user = await currentUser();
  // const { redirectToSignIn } = await auth();

  // if (!user) {
  //   redirectToSignIn();
  //   return;
  // }

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
