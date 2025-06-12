"use client";

import Logo from "@/components/logo";
import LoadingIndicator from "@/components/site/link-status";
import ModeToggle from "@/components/site/mode-toggle";
import { NavUser } from "@/components/site/nav-user";
import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import {
  BookOpenIcon,
  ChartNetworkIcon,
  ChevronRightIcon,
  LifeBuoyIcon,
  NetworkIcon,
  SquareTerminalIcon,
  UserCog2Icon,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  children: React.ReactNode;
}

interface Item {
  title: string;
  url: string;
}

interface NavItem extends Item {
  icon: React.FC;
  isActive?: boolean;
  items?: Item[];
}

interface NavData {
  navMain: NavItem[];
  navSecondary: NavItem[];
}

const data: NavData = {
  navMain: [
    {
      title: "Overview",
      url: "/admin-dashboard",
      icon: SquareTerminalIcon,
    },
    {
      title: "Agencies",
      url: "/admin-dashboard/agencies",
      icon: ChartNetworkIcon,
      items: [],
    },
    {
      title: "Users",
      url: "/admin-dashboard/users",
      icon: UserCog2Icon,
      items: [],
    },
    {
      title: "Packages",
      url: "/admin-dashboard/packages",
      icon: NetworkIcon,
      items: [],
    },
    {
      title: "Agency Verification",
      url: "/admin-dashboard/agency-verifications",
      icon: ShieldCheck,
      items: [],
    },
    // {
    //   title: "Settings",
    //   url: "/dashboard/settings",
    //   icon: Settings2Icon,
    //   items: [],
    // },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoyIcon,
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: BookOpenIcon,
      items: [],
    },
    // {
    //   title: "Feedback",
    //   url: "/feedback",
    //   icon: SendIcon,
    // },
  ],
};

const DashboardSidebar = ({ children }: DashboardSidebarProps) => {
  const sidebar = useSidebar();
  const rawPathName = usePathname();

  return (
    <>
      <Sidebar variant="inset">
        {/* Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                className={cn(
                  "h-[36px] overflow-hidden transition-all [&>div]:w-full",
                  sidebar.open ? "" : "-mx-1"
                )}
              >
                <Logo className="text-blue-500" />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <hr />

        <SidebarContent>
          {/* Primary */}
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const isActive = item.url === rawPathName;

                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={isActive}
                        asChild
                        tooltip={item.title}
                        className={cn({
                          "bg-blue-500 hover:bg-blue-600 text-white font-extrabold":
                            isActive,
                          "hover:bg-blue-300 dark:hover:bg-muted font-normal":
                            !isActive,
                        })}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                          <LoadingIndicator />
                        </Link>
                      </SidebarMenuButton>
                      {item.items?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRightIcon />
                              <span className="sr-only">Toggle</span>
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={subItem.url}>
                                      {subItem.title}
                                      <LoadingIndicator />
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>

          {/* Secondary */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        <LoadingIndicator />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center place-content-between gap-2">
              <NavUser />
              <ModeToggle />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};

export default DashboardSidebar;
