"use client";

import { User, Client, Ticket } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardFooter,
  CardDescription,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";
import { CalendarIcon, Link2Icon, Contact2Icon, User2Icon } from "lucide-react";
import { LaneTicket } from "@/lib/types";

export default function TicketCard({ ticket }: { ticket: LaneTicket }) {
  return (
    <Card className="my-4 dark:bg-slate-900 bg-white shadow-none transition-all">
      <CardHeader className="p-[12px]">
        <TicketTitle title={ticket.title} />
        {/* */}
        <TicketDate date={ticket.createdAt} />
        {/* */}
        <TicketDescription description={ticket.description || ""} />
        {/* */}
        <TicketClient client={ticket.Client} />
      </CardHeader>
      <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 flex items-center justify-between">
        <TicketAssignedUser user={ticket.assigneeUser} />
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
      <CalendarIcon size="20" /> {new Date(date).toLocaleString()}
    </span>
  );
}

function TicketTags({ tags }: { tags: string[] }) {
  // return (<div className="flex items-center flex-wrap gap-2">
  //   {tags.map((tag) => (
  //     <TagComponent key={tag.id} title={tag.name} colorName={tag.color} />
  //   ))}

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

function TicketClient({ client }: { client: Client | null | undefined }) {
  // If the ticket is not associated with any client.
  // TODO: Clicking on this lets you assign a client
  if (!client) {
    return (
      <div className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center">
        <Link2Icon />
        <span className="text-xs font-bold">ASSIGN A CLIENT</span>
      </div>
    );
  }

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
              {client.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{client.name}</h4>
            <p className="text-sm text-muted-foreground">{client.email}</p>
            <div className="flex items-center pt-2">
              <Contact2Icon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined {new Date(client.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function TicketAssignedUser({ user }: { user: User | null | undefined }) {
  const assigned = !!user;
  const fullName = assigned ? `${user.firstName} ${user.lastName}` : "";

  return (
    <div className="flex item-center gap-2">
      <Avatar className="w-8 h-8">
        <AvatarImage alt="contact" src={user?.avatarUrl} />
        <AvatarFallback className="bg-primary text-sm text-white">
          {fullName}
          {assigned && <User2Icon size={14} />}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <span className="text-sm text-muted-foreground">
          {assigned ? "Assigned to" : "Not Assigned"}
        </span>
        {assigned && (
          <span className="text-xs w-28  overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
            {fullName}
          </span>
        )}
      </div>
    </div>
  );
}
