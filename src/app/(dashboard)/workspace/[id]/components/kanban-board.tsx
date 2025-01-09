"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import clsx from "clsx";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Contact2Icon,
  EditIcon,
  Link2Icon,
  MoreVerticalIcon,
  PlusCircleIcon,
  Trash2Icon,
  User2Icon,
} from "lucide-react";
import { useState } from "react";

interface KanbanBoardProps {
  id: string;
  name: string;
}

interface Lane {
  id: string;
  name: string;
  // createdAt: Date;
  // updatedAt: Date;
  pipelineId: string;
  order: number;
  colour: string;
  //
  collapsed: boolean;
}

type Ticket = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  laneId: string;
  order: number;
  value: number | null;
  description: string | null;
  customerId: string | null;
  assignedUserId: string | null;
};

export default function KanbanBoard({ id, name }: KanbanBoardProps) {
  const [lanes, setLanes] = useState<Lane[]>([
    {
      id: "1",
      name: "Column 1",
      order: 1,
      pipelineId: id,
      colour: "#ff00ff",
      collapsed: true,
    },
    {
      id: "2",
      name: "Column 2",
      order: 2,
      pipelineId: id,
      colour: "#ff3300",
      collapsed: false,
    },
    {
      id: "3",
      name: "Column 3",
      order: 3,
      pipelineId: id,
      colour: "#33ff00",
      collapsed: false,
    },
    {
      id: "4",
      name: "Column 4",
      order: 4,
      pipelineId: id,
      colour: "#000088",
      collapsed: false,
    },
    {
      id: "5",
      name: "Column 5",
      order: 5,
      pipelineId: id,
      colour: "#660066",
      collapsed: false,
    },
    {
      id: "6",
      name: "Column 6",
      order: 6,
      pipelineId: id,
      colour: "#55BBAA",
      collapsed: false,
    },
  ]);

  const toggleCollapse = (laneId: string) => {
    setLanes((prevLanes) =>
      prevLanes.map((lane) =>
        lane.id === laneId ? { ...lane, collapsed: !lane.collapsed } : lane
      )
    );
  };

  return (
    <div className="w-[90%] h-screen px-[10px] gap-2 overflow-y-hidden">
      <div className="m-auto w-full flex gap-2 overflow-x-auto overflow-y-visible bg-red-200/20">
        {lanes.map((lane) => (
          <LaneContainer
            key={lane.id}
            lane={lane}
            toggleCollapse={toggleCollapse}
          />
        ))}
      </div>
    </div>
  );
}

function LaneContainerHeader({
  collapsed,
  colour,
  name,
  onToggleCollapse,
}: {
  collapsed: boolean;
  colour: string;
  name: string;
  onToggleCollapse: () => void;
}) {
  const CASH_AMOUNT = 5_000;

  // absolute top-0 left-0 right-0
  return (
    // <AlertDialog>
    //   <DropdownMenu>
        <div
          className={clsx(
            "rounded-tr-lg rounded-tl-lg backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 z-10",
            {
              "h-14": !collapsed,
              "h-full": collapsed,
            }
          )}
        >
          <div className="bg-white/10 h-full flex items-center p-4 justify-between cursor-grab border-b-[1px]">
            <div
              className={clsx("gap-2 place-items-center", {
                "flex flex-row h-auto w-fit": collapsed,
                "items-center flex flex-row": !collapsed,
              })}
            >
              <Button
                variant={"secondary"}
                size="icon"
                onClick={onToggleCollapse}
              >
                {!collapsed ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </Button>
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: colour }}
              />
              <span
                className={clsx("font-bold text-sm max-w-full", {
                  "pl-12 whitespace-nowrap max-w-[50vh]": collapsed,
                })}
              >
                {name}
              </span>
            </div>
            {/* */}
            <div
              className={clsx("flex items-center gap-1", {
                "flex-row": !collapsed,
                hidden: collapsed,
              })}
            >
              <Badge variant={"secondary"}>${CASH_AMOUNT.toFixed(2)}</Badge>
              {/* <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="p-3 m-0 space-x-0 space-y-0 rounded-full text-muted-foreground cursor-pointer"
                >
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger> */}
            </div>
          </div>
        </div>

    //     <DropdownMenuContent>
    //       <DropdownMenuLabel>Options</DropdownMenuLabel>
    //       <DropdownMenuSeparator />
    //       <AlertDialogTrigger>
    //         <DropdownMenuItem className="flex items-center gap-2">
    //           <Trash2Icon size={15} />
    //           Delete
    //         </DropdownMenuItem>
    //       </AlertDialogTrigger>

    //       <DropdownMenuItem
    //         className="flex items-center gap-2"
    //         onClick={() => alert("Edit lane")}
    //       >
    //         <EditIcon size={15} />
    //         Edit
    //       </DropdownMenuItem>
    //       <DropdownMenuItem
    //         className="flex items-center gap-2"
    //         onClick={() => alert("Create ticket")}
    //       >
    //         <PlusCircleIcon size={15} />
    //         Create Ticket
    //       </DropdownMenuItem>
    //     </DropdownMenuContent>
    //     <AlertDialogContent>
    //       <AlertDialogHeader>
    //         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    //         <AlertDialogDescription>
    //           This action cannot be undone. This will permanently delete the
    //           lane and associated data.
    //         </AlertDialogDescription>
    //       </AlertDialogHeader>
    //       <AlertDialogFooter className="flex items-center">
    //         <AlertDialogCancel>Cancel</AlertDialogCancel>
    //         <AlertDialogAction
    //           className="bg-destructive"
    //           onClick={() => alert("Delete lane")}
    //         >
    //           Continue
    //         </AlertDialogAction>
    //       </AlertDialogFooter>
    //     </AlertDialogContent>
    //   </DropdownMenu>
    // </AlertDialog>
  );
}

function getDummyTasks(laneId: string) {
  return laneId === "1"
    ? [
        {
          id: "1",
          name: "Ticket 1",
          createdAt: new Date(),
          updatedAt: new Date(),
          laneId: "1",
          order: 1,
          value: 100,
          description: "This is a ticket",
          customerId: "1",
          assignedUserId: "1",
        },
        {
          id: "2",
          name: "Ticket 2",
          createdAt: new Date(),
          updatedAt: new Date(),
          laneId: "1",
          order: 2,
          value: 200,
          description: "This is a ticket",
          customerId: "1",
          assignedUserId: "1",
        },
      ]
    : laneId === "2"
    ? [
        {
          id: "1",
          name: "Ticket 1",
          createdAt: new Date(),
          updatedAt: new Date(),
          laneId: "1",
          order: 1,
          value: 100,
          description: "This is a ticket",
          customerId: "1",
          assignedUserId: "1",
        },
      ]
    : [];
}

function LaneContainerBody({ laneId }: { laneId: string }) {
  const [tickets, setTickets] = useState<Ticket[]>(getDummyTasks(laneId));

  return (
    <div className="w-full h-full p-2">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
      {/* <AddTicketCard /> */}
    </div>
  );
}

// function AddTicketCard() {
//   return (
//     <Button
//       variant={"secondary"}
//       size="lg"
//       className="p-4 dark:bg-slate-900 bg-white shadow-none transition-all w-full rounded-xl"
//     >
//       <PlusCircleIcon /> Add Ticket
//     </Button>
//   );
// }

function TicketTitle({ title }: { title: string }) {
  return (
    <CardTitle className="flex items-center justify-between">
      <span className="text-lg w-full">{title}</span>
    </CardTitle>
  );
}

function TicketDate({ date }: { date: Date }) {
  return (
    <span className="flex flex-row items-center gap-2 text-muted-foreground text-xs">
      <CalendarIcon size="20" /> {date.toLocaleDateString()}
    </span>
  );
}

function TicketTags({ tags }: { tags: string[] }) {
  // return (<div className="flex items-center flex-wrap gap-2">
  //   {tags.map((tag) => (
  //     <TagComponent key={tag.id} title={tag.name} colorName={tag.color} />
  //   ))}
  // </div>);

  // return (
  //   <div className="flex items-center flex-wrap gap-2">
  //     {tags.map((tag) => (
  //       <Badge key={tag} variant={"secondary"} className="">
  //         {tag}
  //       </Badge>
  //     ))}
  //   </div>
  // );

  return null;
}

function TicketDescription({ description }: { description: string }) {
  return <CardDescription className="w-full ">{description}</CardDescription>;
}

function TicketClient() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center">
          <Link2Icon />
          <span className="text-xs font-bold">CONTACT</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="right" className="w-fit">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>
              {"CUSTOMER NAME".slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{"CUSTOMER NAME"}</h4>
            <p className="text-sm text-muted-foreground">{"CUSTOMER EMAIL"}</p>
            <div className="flex items-center pt-2">
              <Contact2Icon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined {"CUSTOMER DATE"}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function TicketAssignedUser() {
  return (
    <div className="flex item-center gap-2">
      <Avatar className="w-8 h-8">
        <AvatarImage alt="contact" src={"AVATAR URL"} />
        <AvatarFallback className="bg-primary text-sm text-white">
          {"ASSIGNED NAME"}
          {!!"ASSIGNED ID" && <User2Icon size={14} />}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <span className="text-sm text-muted-foreground">
          {"ASSIGNED ID" ? "Assigned to" : "Not Assigned"}
        </span>
        {"ASSIGNED ID" && (
          <span className="text-xs w-28  overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
            {"ASSIGNED NAME"}
          </span>
        )}
      </div>
    </div>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Card className="my-4 dark:bg-slate-900 bg-white shadow-none transition-all">
      <CardHeader className="p-[12px]">
        <TicketTitle title={ticket.name} />
        {/* */}
        <TicketDate date={ticket.createdAt} />
        <TicketTags tags={[]} />
        {/* */}
        <TicketDescription description={ticket.description || ""} />
        {/* */}
        <TicketClient />
      </CardHeader>
      <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 flex items-center justify-between">
        <TicketAssignedUser />
        <span className="text-sm font-bold">
          {!!ticket.value &&
            new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "USD",
            }).format(+ticket.value)}
        </span>
      </CardFooter>
    </Card>
  );
}

function LaneContainerFooter() {
  return (
    <div className="rounded-bl-lg rounded-br-lg h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 z-10">
      <div className="bg-white/10 h-full flex items-center p-4 justify-between cursor-grab border-t-[1px]">
        <div className="flex items-center w-full gap-2">
          <Button
            variant={"ghost"}
            className="p-2 hover:bg-transparent bg-transparent font-bold text-sm"
          >
            Add a Ticket...
          </Button>
        </div>
        <LaneContainerFooterActions />
      </div>
    </div>
  );
}

function LaneContainerFooterActions() {
  return (
    <div className="flex items-center flex-row">
      <CalendarIcon className="text-muted-foreground cursor-pointer" />
      <User2Icon className="text-muted-foreground cursor-pointer" />
      <Link2Icon className="text-muted-foreground cursor-pointer" />
    </div>
  );
}

function LaneContainer({
  lane,
  toggleCollapse,
}: {
  lane: Lane;
  toggleCollapse: (laneId: string) => void;
}) {
  // relative
  if(lane.collapsed) {
    return (
      <div className="bg-slate-200/50 dark:white/50 rounded-lg gap-0 p-0 space-x-0 space-y-0 flex flex-row mb-2 h-full pl-10 rotate-90 w-[10%]">
        <LaneContainerHeader
          collapsed={lane.collapsed}
          colour={lane.colour}
          name={lane.name}
          onToggleCollapse={() => toggleCollapse(lane.id)}
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-200/50 dark:white/50 rounded-lg gap-0 p-0 space-x-0 space-y-0 flex flex-col mb-2 h-full">
      <LaneContainerHeader
        collapsed={lane.collapsed}
        colour={lane.colour}
        name={lane.name}
        onToggleCollapse={() => toggleCollapse(lane.id)}
      />
      {<LaneContainerBody laneId={lane.id} />}
      {<LaneContainerFooter />}
    </div>
  );
}
