import { Calendar, Home, Inbox, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import Link from "next/link";

const DashboardSidebar = () => {
  const items = [
    {
      title: "Overview",
      url: "#",
      icon: Home,
    },
    {
      title: "Billing",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Team",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Workspace",
      url: "#",
      icon: Search,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "true";

  return (
    <div className="w-screen h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar />
        <SidebarInset>
          <div>
            <SidebarTrigger />
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
