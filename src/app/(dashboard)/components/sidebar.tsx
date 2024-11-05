"use client";

import Logo from "@/components/logo";
import CustomModal from "@/components/site/custom-modal";
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
import useIsMounted from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
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
      url: "/dashboard/billing",
      icon: ChartNetworkIcon,
      items: [],
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: UserCog2Icon,
      items: [],
    },
    {
      title: "Workspaces",
      url: "/dashboard/workspace",
      icon: NetworkIcon,
      items: [],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
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
      title: "Documentation",
      url: "/documentation",
      icon: BookOpenIcon,
      items: [],
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: SendIcon,
    },
  ],
};

const PickerItem = ({
  isWorkspace,
  id,
  name,
  logoUrl,
  address,
}: {
  isWorkspace: boolean;
  id: string;
  name: string;
  logoUrl: string;
  address: string;
}) => {
  return (
    <CommandItem className="my-2 text-primary border-[1px] border-border p-2 rounded-md cursor-pointer transition-all">
      <Link
        href={`/${isWorkspace ? "workspace" : "agency"}/${id}`}
        className="flex gap-4 w-full h-full"
      >
        <div className="relative w-16">
          <Image
            src={logoUrl}
            alt={name}
            fill
            className="rounded-md object-contain"
          />
        </div>
        <div className="flex flex-col flex-1">
          {name}
          <span className="text-muted-foreground">{address}</span>
        </div>
      </Link>
    </CommandItem>
  );
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

  const isMounted = useIsMounted();
  const t = useTranslations();
  const { openModal } = useModal();

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
                    <PickerItem
                      id={user.Agency.id}
                      name={user.Agency.name}
                      address={user.Agency.address}
                      isWorkspace={false}
                      logoUrl={user.Agency.logoUrl}
                    />
                  </CommandGroup>
                )}

              {/* Workspaces */}
              <CommandSeparator />
              <CommandGroup heading={t("WORKSPACES")}>
                {workspaces
                  ? workspaces.map((e) => (
                      <PickerItem
                        key={e.id}
                        id={e.id}
                        name={e.name}
                        address={e.address}
                        isWorkspace={true}
                        logoUrl={e.logoUrl}
                      />
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
                openModal(
                  <CustomModal
                    title={t("CREATE_WORKSPACE")}
                    caption={t("CREATE_WORKSPACE_CAPTION")}
                  >
                    <div>{/* TODO: Add workspace */}</div>
                  </CustomModal>
                );
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
      <Sidebar className="bg-muted" variant="inset">
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
          {/* Agency Switcher */}
          <SidebarGroup>
            <SidebarGroupLabel>Agency</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
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
                          "bg-blue-500 hover:bg-blue-600 text-white font-extrabold":
                            isActive,
                          "hover:bg-blue-300 dark:hover:bg-blue-400 font-normal":
                            !isActive,
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
                                    <Link href={subItem.url}>
                                      {subItem.title}
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
            <SidebarMenuItem className="flex items-center place-content-evenly gap-2">
              <UserButton
                showName
                appearance={{
                  elements: {
                    avatarBox: "rounded-lg",
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
