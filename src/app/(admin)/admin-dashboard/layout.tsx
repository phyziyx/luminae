import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/admin-sidebar";
import { currentUser, auth } from "@clerk/nextjs/server";
import UserManager from "@/lib/managers/userManager";

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
