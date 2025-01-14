import {
  CalendarIcon,
  Contact2Icon,
  EditIcon,
  Link2Icon,
  User2Icon,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card";
import { Client, User } from "@prisma/client";
import { useKanban } from "@/providers/kanban-provider";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LaneTicket } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { Button } from "../ui/button";
import CustomModal from "../site/custom-modal";

export function TicketCard({ ticket }: { ticket: LaneTicket }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ticket.id,
    data: {
      type: "Ticket",
      ticket,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    // style.opacity = 0.6;
    // OR
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="bg-gray-300 p-2 h-[200px] min-h-[200px]
		items-center flex justify-between text-left rounded-xl ring-2 ring-inset
		ring-rose-500 border-2 border-gray-500
		cursor-grab relative opacity-40"
      />
    );
  }

  function TicketTitle({ title }: { title: string }) {
    const { openModal } = useModal();
    const { workspaceId } = useKanban();

    return (
      <CardTitle className="flex items-center justify-between">
        <span className="text-lg w-full">{title}</span>
        <Button
          variant={"ghost"}
          onClick={() => {
            openModal(
              <CustomModal
                title="Add a Ticket"
                caption="Add a ticket to the lane"
              >
                <LaneTicketModal />
              </CustomModal>
            );
          }}
        >
          <EditIcon className="text-muted-foreground cursor-pointer" />
        </Button>
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
            {!assigned && <User2Icon size={22} />}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center">
          <span className="text-sm text-muted-foreground">
            {assigned ? "Assigned to" : "Not Assigned"}
          </span>
          {assigned && (
            <span className="text-xs w-28 overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
              {fullName}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="dark:bg-slate-900 bg-slate-100 shadow-none transition-all"
    >
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
