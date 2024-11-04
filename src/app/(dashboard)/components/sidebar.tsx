"use client";

import Logo from "@/components/logo";
import ModeToggle from "@/components/site/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandSeparator,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { UserButton } from "@clerk/nextjs";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import {
  BookOpenIcon,
  ChartNetworkIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CompassIcon,
  LifeBuoyIcon,
  NetworkIcon,
  PlusCircleIcon,
  SendIcon,
  Settings2Icon,
  SquareTerminalIcon,
  UserCog2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
      url: "/dashboard",
      icon: SquareTerminalIcon,
    },
    {
      title: "Billing",
      url: "/billing",
      icon: ChartNetworkIcon,
      items: [],
    },
    {
      title: "Team",
      url: "/team",
      icon: UserCog2Icon,
      items: [],
    },
    {
      title: "Workspaces",
      url: "/workspaces",
      icon: NetworkIcon,
      items: [],
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: BookOpenIcon,
      items: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2Icon,
      items: [],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoyIcon,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: SendIcon,
    },
  ],
};

const AgencyPicker = () => {
  const details = {
    name: "Agency Name",
    address: "Agency Address",
  };

  const user = {
    role: "AGENCY_OWNER",
    Agency: {
      id: "1",
      name: "Agency Name",
      address: "Agency Address",
      logoUrl: "/images/logo.png",
    },
  };

  const workspaces = [
    {
      id: "1",
      name: "Workspace Name",
      address: "Workspace Address",
      logoUrl: "/images/logo.png",
    },
    {
      id: "2",
      name: "Workspace Name 2",
      address: "Workspace Address 2",
      logoUrl: "/images/logo.png",
    },
  ];

  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Popover>
        {/* Trigger */}
        <PopoverTrigger asChild>
          <Button
            className="w-full flex items-center justify-between py-8"
            variant="secondary"
          >
            <div className="flex items-center text-left gap-2">
              <CompassIcon />
              <div className="flex flex-col">
                {details.name}
                <span className="text-wrap text-xs text-muted-foreground">
                  {t("SEARCH_IN_AGENCY")}
                </span>
              </div>
            </div>
            <div>
              <ChevronsUpDownIcon size={16} className="text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>

        {/* Content */}
        <PopoverContent className="rounded-lg w-80 mt-4 z-[200]">
          <Command>
            <CommandInput placeholder={t("SEARCH_IN_AGENCY")} />
            <CommandList className="pb-16">
              <CommandEmpty>{t("NO_RESULTS_FOUND")}</CommandEmpty>
              {/* Agency */}
              {(user?.role === "AGENCY_OWNER" ||
                user?.role === "AGENCY_ADMIN") &&
                user?.Agency && (
                  <CommandGroup heading="Agency">
                    <CommandItem className="!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md cursor-pointer transition-all">
                      {
                        <Link
                          href={`/agency/${user?.Agency?.id}`}
                          className="flex gap-4 w-full h-full"
                        >
                          <div className="relative w-16">
                            <Image
                              src={user?.Agency?.logoUrl}
                              alt={user?.Agency?.name}
                              fill
                              className="rounded-md object-contain"
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            {user?.Agency?.name}
                            <span className="text-muted-foreground">
                              {user?.Agency?.address}
                            </span>
                          </div>
                        </Link>
                      }
                    </CommandItem>
                  </CommandGroup>
                )}

              {/* Workspaces */}
              <CommandSeparator />
              <CommandGroup heading={t("WORKSPACES")}>
                {workspaces
                  ? workspaces.map((e) => (
                      <CommandItem
                        key={e.id}
                        className="my-2 text-primary border-[1px] border-border p-2 rounded-md cursor-pointer transition-all"
                      >
                        {
                          <Link
                            href={`/workspace/${e.id}`}
                            className="flex gap-4 w-full h-full"
                          >
                            <div className="relative w-16">
                              <Image
                                src={e.logoUrl}
                                alt={e.name}
                                fill
                                className="rounded-md object-contain"
                              />
                            </div>
                            <div className="flex flex-col flex-1">
                              {e.name}
                              <span className="text-muted-foreground">
                                {e.address}
                              </span>
                            </div>
                          </Link>
                        }
                      </CommandItem>
                    ))
                  : t("NO_WORKSPACES_FOUND")}
              </CommandGroup>
            </CommandList>
          </Command>

          {/* Create New Workspace */}
          {(user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") && (
            <Button
              className="w-full flex gap-2"
              onClick={() => {
                // TODO: Create Workspace Modal
              }}
            >
              <PlusCircleIcon size={15} />
              {t("CREATE_WORKSPACE")}
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

const DashboardSidebar = ({ children }: { children: React.ReactNode }) => {
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

        <SidebarContent>
          {/* Agency Switcher */}
          <SidebarGroup>
            <SidebarGroupLabel>Agency</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))} */}
                <AgencyPicker />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

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
                          "bg-blue-500 hover:bg-blue-600 text-white": isActive,
                          "hover:bg-blue-300 dark:hover:bg-blue-400": !isActive,
                        })}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
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
                                    <a href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </a>
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
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
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
            <SidebarMenuItem className="flex items-center gap-2">
              <UserButton
                showName
                appearance={{
                  elements: {
                    rootBox: "flex overflow-hidden",
                    userButtonBox: "flex-row-reverse",
                    userButtonOuterIdentifier: "truncate pl-0 dark:text-white",
                  },
                }}
              />
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
