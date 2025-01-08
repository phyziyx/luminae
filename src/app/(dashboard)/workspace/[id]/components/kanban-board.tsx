"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import {
  CalendarIcon,
  Contact2Icon,
  Link2Icon,
  MoreVerticalIcon,
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
      pipelineId: "1",
      colour: "#ff00ff",
    },
    {
      id: "2",
      name: "Column 2",
      order: 2,
      pipelineId: "1",
      colour: "#ff3300",
    },
    {
      id: "3",
      name: "Column 3",
      order: 3,
      pipelineId: "1",
      colour: "#33ff00",
    },
    {
      id: "4",
      name: "Column 4",
      order: 4,
      pipelineId: "1",
      colour: "#00ff33",
    },
  ]);

  return (
    <div className="flex w-full overflow-x-auto overflow-y-hidden px-[10px] gap-2">
      <div className="m-auto w-full flex gap-2">
        {lanes.map((lane) => (
          <LaneContainer key={lane.id} lane={lane} />
        ))}
      </div>
    </div>
  );
}

function LaneContainerHeader({
  colour,
  name,
}: {
  colour: string;
  name: string;
}) {
  // absolute top-0 left-0 right-0
  return (
    <div className="rounded-tr-lg rounded-tl-lg h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 z-10">
      <div className="bg-white/10 h-full flex items-center p-4 justify-between cursor-grab border-b-[1px]">
        <div className="flex items-center w-full gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ background: colour }}
          />
          <span className="font-bold text-sm">{name}</span>
        </div>
        <LaneContainerHeaderMoney />
      </div>
    </div>
  );
}

function LaneContainerHeaderMoney() {
  const CASH_AMOUNT = 5_000;

  return (
    <div className="flex items-center flex-row">
      <Badge variant={"secondary"} className="">
        ${CASH_AMOUNT.toFixed(2)}
      </Badge>
      {/* <DropdownMenuTrigger> */}
      <MoreVerticalIcon className="text-muted-foreground cursor-pointer" />
      {/* </DropdownMenuTrigger> */}
    </div>
  );
}

function LaneContainerBody() {
  const [tickets, setTickets] = useState<Ticket[]>([
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
  ]);

  return (
    <div className="w-full h-full p-2">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

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

function LaneContainer({ lane }: { lane: Lane }) {
  // relative
  return (
    <div className="bg-slate-200/50 dark:white/50 rounded-lg gap-0 p-0 space-x-0 space-y-0 w-full h-screen flex flex-col">
      <LaneContainerHeader colour={lane.colour} name={lane.name} />
      <LaneContainerBody />
    </div>
  );
}
