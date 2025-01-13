"use client";

import React, {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";
import {
  CalendarIcon,
  ChevronRightIcon,
  Circle,
  Contact2Icon,
  EditIcon,
  Link2Icon,
  MoreVerticalIcon,
  PlusCircleIcon,
  Trash2Icon,
  User2Icon,
} from "lucide-react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DraggableAttributes,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { Input } from "./ui/input";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "./site/custom-modal";
import clsx from "clsx";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
} from "./ui/alert-dialog";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { Client, Ticket, User } from "@prisma/client";
import { KanbanLane, LaneTicket } from "@/lib/types";
import CreateLaneButton from "./kanban/create-lane-button";
import { LoadingSpinner } from "./site/loading-spinner";
import deleteLane from "@/actions/delete-lane";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import LaneCreateForm from "./kanban/lane-container/lane-form";
import { z } from "zod";
import { LaneTicketFormSchema, laneTicketFormSchema } from "@/lib/forms";
import onUpdateTicket from "@/actions/update-ticket";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { DialogFooter } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useSWR from "swr";
import fetchMembersByWorkspace from "@/actions/fetch-members-by-workspace";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

function LaneTicketForm({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: LaneTicketFormSchema;
}) {
  const form = useForm<LaneTicketFormSchema>({
    resolver: zodResolver(laneTicketFormSchema),
    defaultValues: {
      ...data,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof laneTicketFormSchema>) => {
    try {
      const response = await onUpdateTicket(values);

      toast({
        title: response?.error || "User information saved successfully",
        variant: response?.error ? "destructive" : "default",
      });
    } catch {
      toast({
        title: "An error occurred while saving the user information",
        variant: "destructive",
      });
    }
  };

  const isLoading = form.formState.isSubmitting;
  const t = useTranslations();

  // const {
  //   data: clientsData,
  //   error,
  //   isLoading: isLoadingClients,
  // } = useSWR(["clients"], () => fetchAgencyDetails(agencyId));

  const {
    data: membersData,
    error: membersError,
    isLoading: isLoadingMembers,
  } = useSWR(["members", workspaceId], ([, workspaceId]) =>
    fetchMembersByWorkspace(workspaceId)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("FORMS.NAME")}</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
            </FormItem>
          )}
        />

        {data.id && (
          <FormField
            control={form.control}
            name="open"
            render={({ field }) => (
              <FormItem className="flex items-center place-items-center gap-2">
                <FormLabel>Open</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Role:</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">{t("TAGS.HIGH")}</SelectItem>
                    <SelectItem value="Medium">{t("TAGS.MEDIUM")}</SelectItem>
                    <SelectItem value="Low">{t("TAGS.LOW")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {isLoadingClients && (
                      <SelectItem value="" disabled>
                        <LoadingSpinner />
                      </SelectItem>
                    )} */}
                    {/* {clientsData?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Command>
          <CommandInput placeholder={t("SEARCH_IN_AGENCY")} />
          <CommandList>
            <CommandEmpty>{t("NO_RESULTS_FOUND")}</CommandEmpty>
            <CommandGroup>
              {isLoadingMembers && (
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}
              {(membersData || []).map((member) => (
                <CommandItem
                  key={member.id}
                  className="flex flex-row justify-between p-1 border-b"
                >
                  <Avatar>
                    <AvatarImage src={member.user.avatarUrl} />
                    <AvatarFallback>{member.user.firstName}</AvatarFallback>
                  </Avatar>
                  <span>{`${member.user.firstName} ${member.user.lastName}`}</span>

                  <div className="flex items-center space-x-2 text-xs">
                    {/* <Controller
                            name={`workspaces.${index}.access`}
                            control={form.control}
                            render={({ field }) => (
                              <>
                                <label
                                  htmlFor={`access-${workspace.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {t("INVITE_TEAM_MEMBER.HAS_ACCESS")}
                                </label>
                                <Checkbox
                                  id={`access-${workspace.id}`}
                                  checked={field.value}
                                  onCheckedChange={(checked) =>
                                    field.onChange(checked)
                                  }
                                />
                              </>
                            )}
                          /> */}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : t("BUTTONS.SAVE_CHANGES")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function LaneContainerFooter({
  createTicket,
  laneId,
  workspaceId,
}: {
  laneId: string;
  createTicket: (laneId: string) => void;
  workspaceId: string;
}) {
  const { openModal } = useModal();

  return (
    <div className="rounded-bl-lg rounded-br-lg h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 z-10">
      <div className="bg-white/10 h-full flex items-center p-4 justify-between cursor-grab border-t-[1px]">
        <div className="flex items-center w-full gap-2">
          <Button
            variant={"ghost"}
            className="p-2 hover:bg-transparent bg-transparent font-bold text-sm"
            onClick={() => {
              openModal(
                <CustomModal
                  title="Add a Ticket"
                  caption="Add a ticket to the lane"
                >
                  <LaneTicketForm
                    workspaceId={workspaceId}
                    data={{
                      laneId: laneId,
                      clientId: "",
                      description: "",
                      name: "",
                      tag: "High",
                      userId: "",
                      value: "0",
                      id: "",
                      open: true,
                    }}
                  />
                </CustomModal>
              );
            }}
          >
            Add a Ticket...
          </Button>
        </div>
        <div className="flex items-center flex-row">
          <CalendarIcon className="text-muted-foreground cursor-pointer" />
          <User2Icon className="text-muted-foreground cursor-pointer" />
          <Link2Icon className="text-muted-foreground cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

function LaneContainerBody({
  tickets,
  deleteTicket,
  ticketIds,
}: {
  tickets: Array<LaneTicket>;
  deleteTicket: (id: string) => void;
  ticketIds: Array<string>;
}) {
  return (
    <div className="flex flex-col flex-grow p-4 gap-2 overflow-x-hidden overflow-y-auto">
      <SortableContext items={ticketIds}>
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            deleteTicket={deleteTicket}
          />
        ))}
      </SortableContext>
    </div>
  );
}

function LaneContainer({
  lane,
  deleteLane,
  updateLaneTitle,
  createTicket,
  tickets,
  deleteTicket,
}: {
  lane: KanbanLane;
  deleteLane: (id: string) => void;
  updateLaneTitle: (id: string, title: string) => void;
  createTicket: (id: string) => void;
  tickets: Array<LaneTicket>;
  deleteTicket: (id: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lane.id,
    data: {
      type: "Lane",
      lane,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const ticketIds = useMemo(
    () => tickets.map((ticket) => ticket.id) || [],
    [tickets]
  );

  if (isDragging) {
    // style.opacity = 0.6;
    // OR
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 bg-red-200 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border-2 border-rose-500"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-200/50 dark:white/50 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* Column Title */}
      <LaneContainerHeader
        attributes={attributes}
        listeners={listeners}
        setEditMode={setEditMode}
        editMode={editMode}
        lane={lane}
        updateLaneTitle={updateLaneTitle}
        deleteLane={deleteLane}
      />

      <LaneContainerBody
        deleteTicket={deleteTicket}
        tickets={tickets}
        ticketIds={ticketIds}
      />

      <LaneContainerFooter
        createTicket={createTicket}
        laneId={lane.id}
        workspaceId={lane.workspaceId}
      />
    </div>
  );
}

////////////////////////////////////////

function LaneContainerHeader({
  attributes,
  listeners,
  setEditMode,
  editMode,
  lane,
  updateLaneTitle,
}: {
  attributes: DraggableAttributes;
  listeners: undefined | SyntheticListenerMap;
  setEditMode: (value: boolean) => void;
  editMode: boolean;
  lane: KanbanLane;
  updateLaneTitle: (id: string, title: string) => void;
  deleteLane: (id: string) => void;
}) {
  const t = useTranslations();
  const { openModal } = useModal();

  const collapsed = false;
  const toggleCollapse = (id: string) => {
    console.log("Toggling collapse for lane:", id);
  };
  const CASH_AMOUNT = "$5,000.00";

  const deleteLaneWithId = deleteLane.bind(null, {
    workspaceId: lane.workspaceId,
    laneId: lane.id,
  });
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteLaneWithId,
    {
      error: "",
    }
  );

  function onEditLane() {
    openModal(
      <CustomModal
        title={t("KANBAN.CREATE_LANE_TITLE")}
        caption={t("KANBAN.CREATE_LANE_CAPTION")}
      >
        <LaneCreateForm
          data={{
            id: lane.id,
            workspaceId: lane.workspaceId,
            name: "",
            colour: "AA00AA",
          }}
        />
      </CustomModal>
    );
  }

  useEffect(() => {
    if (deleteState && deleteState.error) {
      toast({
        title: deleteState.error || "Failed to delete lane",
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteState]);

  return (
    <AlertDialog>
      <DropdownMenu>
        <div
          {...attributes}
          {...listeners}
          className="backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 z-10
      rounded-lg rounded-b-none border-b-[1px]
      text-md h-[60px] cursor-grab p-2 font-bold flex flex-row gap-2 items-center place-items-center"
          onDoubleClick={() => setEditMode(true)}
        >
          <div className="flex w-full items-center place-items-center justify-between">
            <div
              className={clsx("gap-2 place-items-center", {
                "items-center flex flex-row": !collapsed,
                "flex flex-col h-full w-fit": collapsed,
              })}
            >
              <Button
                variant={"secondary"}
                size="icon"
                onClick={() => toggleCollapse(lane.id)}
              >
                <ChevronRightIcon
                  className={clsx(
                    "transform transition-transform duration-300",
                    {
                      "rotate-90": collapsed,
                    }
                  )}
                />
              </Button>
              <Circle
                style={{
                  fill: `#${lane.colour}`,
                  stroke: `#${lane.colour}`,
                }}
              />
              {/* {editMode ? (
                <Input
                  autoFocus
                  value={lane.name}
                  className="text-md font-bold w-full"
                  onChange={(e) => updateLaneTitle(lane.id, e.target.value)}
                  onBlur={() => setEditMode(false)}
                  onKeyDown={(e) => {
                    setEditMode(
                      !((e.key === "Enter" || e.key === "Escape") && editMode)
                    );

                    if (e.key === "Enter") {
                      setEditMode(false);
                    }
                  }}
                />
              ) : (
                lane.name
              )} */}
              {lane.name} ({lane.order})
            </div>

            {/* */}
            <div
              className={clsx("flex items-center gap-1", {
                "flex-row": !collapsed,
                hidden: collapsed,
              })}
            >
              {!editMode && (
                <Badge variant={"secondary"} className="p-1">
                  {CASH_AMOUNT}
                </Badge>
              )}
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="p-3 m-0 space-x-0 space-y-0 rounded-full text-muted-foreground cursor-pointer"
                >
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
            </div>
          </div>
        </div>

        {/* */}
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="bg-destructive/20 flex items-center gap-2">
              <Trash2Icon size={15} />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onEditLane}
          >
            <EditIcon size={15} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => alert("Create ticket")}
          >
            <PlusCircleIcon size={15} />
            Create Ticket
          </DropdownMenuItem>
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lane and associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={deleteAction}>
              <AlertDialogAction
                type="submit"
                disabled={isDeleting}
                aria-disabled={isDeleting}
                className="bg-destructive"
              >
                {isDeleting ? <LoadingSpinner /> : "Delete"}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
}

function TicketCard({
  ticket,
  deleteTicket,
}: {
  ticket: LaneTicket;
  deleteTicket: (id: string) => void;
}) {
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

const POINTER_ACTIVATION_CONSTRAINT_DISTANCE = 10; // 10 px

function KanbanNew({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: KanbanLane[];
}) {
  const [lanes, setLanes] = useState<KanbanLane[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>(
    data.flatMap((lane) => lane.Tickets)
  );

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const laneIds = useMemo(() => lanes.map((lane) => lane.id) || [], [lanes]);

  const [activeLane, setActiveLane] = useState<KanbanLane | null>(null);

  useEffect(() => {
    setLanes(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: POINTER_ACTIVATION_CONSTRAINT_DISTANCE,
      },
    })
  );

  const dragStateRef = useRef<{
    activeId: string | null | number;
    overId: string | null | number;
  }>({
    activeId: null,
    overId: null,
  });

  function deleteLane(id: string) {
    setLanes((prevLanes) => prevLanes.filter((lane) => lane.id !== id));

    setTickets((prevTickets) =>
      prevTickets.filter((ticket) => ticket.laneId !== id)
    );
  }

  function updateLaneTitle(id: string, title: string) {
    setLanes((prevLanes) =>
      prevLanes.map((lane) =>
        lane.id === id ? { ...lane, name: title } : lane
      )
    );
  }

  function onDragStart(event: DragStartEvent) {
    console.log("\n\nSTARTED DRAGGING EVENT:", event.active.data.current?.type);

    if (event.active.data.current?.type === "Lane") {
      setActiveLane(event.active.data.current.lane);
      return;
    } else if (event.active.data.current?.type === "Ticket") {
      setActiveTicket(event.active.data.current.ticket);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveLane(null);
    setActiveTicket(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (active.data.current?.type === "Lane") {
      setLanes((prevLanes) => {
        const activeLaneIndex = prevLanes.findIndex(
          (lane) => lane.id === activeId
        );
        const overLaneIndex = prevLanes.findIndex((lane) => lane.id === overId);

        return arrayMove(prevLanes, activeLaneIndex, overLaneIndex);
      });

      return;
    }

    if (active.data.current?.type === "Ticket") {
      return;
    }

    console.error("Invalid active data type:", active.data.current?.type);
    // else if (active.data.current?.type === "Ticket") {
    //   setTickets((prevTickets) => {
    //     const activeTicketIndex = prevTickets.findIndex(
    //       (ticket) => ticket.id === activeId
    //     );
    //     const overTicketIndex = prevTickets.findIndex(
    //       (ticket) => ticket.id === overId
    //     );
    //     return arrayMove(prevTickets, activeTicketIndex, overTicketIndex);
    //   });
    // }
  }

  const onDragOver = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveDragTask = active.data.current?.type === "Ticket";
    const isOverDragTask = over.data.current?.type === "Ticket";
    const isOverDragLane = over.data.current?.type === "Lane";

    if (!isActiveDragTask) return;

    const currentDragState = dragStateRef.current;

    // Only process the drag if something has changed
    if (
      currentDragState.activeId === activeId &&
      currentDragState.overId === overId
    ) {
      return;
    }

    // Update the drag state
    dragStateRef.current = { activeId: activeId, overId: overId };

    // Handle moving to a different lane
    if (isOverDragLane) {
      setTickets((prevTickets) => {
        const ticketsCopy = [...prevTickets];
        const activeTicketIndex = ticketsCopy.findIndex(
          (ticket) => ticket.id === activeId
        );

        if (activeTicketIndex === -1) {
          return prevTickets; // Invalid ID, no change needed
        }

        // Update laneId
        ticketsCopy[activeTicketIndex] = {
          ...ticketsCopy[activeTicketIndex],
          laneId: overId as string,
        };

        return ticketsCopy;
      });
    }

    // Handle ticket reordering
    if (isOverDragTask) {
      setTickets((prevTickets) => {
        const ticketsCopy = [...prevTickets];
        const activeTicketIndex = ticketsCopy.findIndex(
          (ticket) => ticket.id === activeId
        );
        const overTicketIndex = ticketsCopy.findIndex(
          (ticket) => ticket.id === overId
        );

        if (activeTicketIndex === -1 || overTicketIndex === -1) {
          return prevTickets; // Invalid IDs, no change needed
        }

        // Update lane if necessary
        ticketsCopy[activeTicketIndex] = {
          ...ticketsCopy[activeTicketIndex],
          laneId: over.data.current?.ticket.laneId,
        };

        return arrayMove(ticketsCopy, activeTicketIndex, overTicketIndex);
      });
      return;
    }
  };

  function createTicket(laneId: string) {
    const newTicket = {
      id: Math.floor(Math.random() * 100_001).toString(),
      title: `New Ticket (${tickets.length + 1})`,
      description: "Ticket description...",
      laneId: laneId,
    };

    setTickets((prevTickets) => [...prevTickets, newTicket]);
  }

  function deleteTicket(id: string) {
    setTickets((prevTickets) =>
      prevTickets.filter((ticket) => ticket.id !== id)
    );
  }

  return (
    <div className="flex-grow m-auto w-full items-center overflow-x-auto overflow-y-hidden p-2">
      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={laneIds}>
              {lanes.map((lane) => (
                <LaneContainer
                  key={lane.id}
                  lane={lane}
                  deleteLane={deleteLane}
                  updateLaneTitle={updateLaneTitle}
                  createTicket={createTicket}
                  tickets={tickets.filter(
                    (ticket) => ticket.laneId === lane.id
                  )}
                  deleteTicket={deleteTicket}
                />
              ))}
            </SortableContext>

            <CreateLaneButton workspaceId={workspaceId} />

            {createPortal(
              <DragOverlay>
                {activeLane && (
                  <LaneContainer
                    lane={activeLane}
                    deleteLane={deleteLane}
                    updateLaneTitle={updateLaneTitle}
                    createTicket={createTicket}
                    tickets={tickets.filter(
                      (ticket) => ticket.laneId === activeLane.id
                    )}
                    deleteTicket={deleteTicket}
                  />
                )}
                {activeTicket && (
                  <TicketCard
                    ticket={activeTicket}
                    deleteTicket={deleteTicket}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanNew;
