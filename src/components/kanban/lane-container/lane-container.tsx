import { useCollapse } from "../collapse-provider";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TicketCard from "../ticket-card";
import CustomModal from "@/components/site/custom-modal";
import { useModal } from "@/providers/modal-provider";
import { CalendarIcon, User2Icon, Link2Icon } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  ChevronRightIcon,
  EditIcon,
  MoreVerticalIcon,
  PlusCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { laneNameEditSchema, LaneNameEditSchema } from "@/lib/forms";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DraggableAttributes } from "@dnd-kit/core";
import { KanbanLane, LaneTicket } from "@/lib/types";

function LaneContainerFooter() {
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
                  title="[TODO] Add a Ticket"
                  caption="Add a ticket to the lane"
                >
                  {/* Add ticket form */}
                  TODO
                </CustomModal>
              );
            }}
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

function LaneContainerHeader({
  colour,
  name,
  id,
  listeners,
  attributes,
}: {
  colour: string;
  name: string;
  id: string;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}) {
  const { getCollapseState, toggleCollapse } = useCollapse();
  const collapsed = getCollapseState(id);

  const [editing, setEditing] = useState(false);

  const form = useForm<LaneNameEditSchema>({
    resolver: zodResolver(laneNameEditSchema),
    defaultValues: {
      name: name,
    },
    mode: "onChange",
  });

  const onSubmit = (data: LaneNameEditSchema) => {
    console.log(data);
    setEditing(false);
  };

  const CASH_AMOUNT = 5_000;

  // absolute top-0 left-0 right-0
  return (
    <AlertDialog>
      <DropdownMenu>
        <div
          className={clsx(
            "backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 z-10",
            {
              "rounded-tr-lg rounded-tl-lg h-14 w-80": !collapsed,
              "rounded-lg h-full": collapsed,
            }
          )}
          {...attributes}
          {...listeners}
        >
          <div className="bg-white/10 h-full flex p-2 justify-between cursor-grab border-b-[1px]">
            <div
              className={clsx("gap-2 place-items-center", {
                "items-center flex flex-row": !collapsed,
                "flex flex-col h-full w-fit": collapsed,
              })}
            >
              <Button
                variant={"secondary"}
                size="icon"
                onClick={() => toggleCollapse(id)}
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
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: `#${colour}` }}
              />
              <span
                onDoubleClick={() => setEditing(!collapsed && true)}
                onBlur={() => setEditing(false)}
                className={clsx(
                  "whitespace-nowrap hover:cursor-text font-bold text-sm",
                  {
                    "w-0 rotate-90": collapsed,
                  }
                )}
              >
                {editing ? (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                onKeyDown={(e) =>
                                  setEditing(
                                    !(e.key === "Enter" || e.key === "Escape")
                                  )
                                }
                                className="w-4/5"
                                placeholder={name}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                ) : (
                  name
                )}
              </span>
            </div>
            {/* */}
            <div
              className={clsx("flex items-center gap-1", {
                "flex-row": !collapsed,
                hidden: collapsed,
              })}
            >
              <Badge variant={"secondary"} className="p-1">
                ${CASH_AMOUNT.toFixed(2)}
              </Badge>
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
            onClick={() => alert("Edit lane")}
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
            <AlertDialogAction
              className="bg-destructive"
              onClick={() => alert("Delete Lane Pressed")}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
}

function LaneContainerBody({ tickets }: { tickets: LaneTicket[] }) {
  return (
    <div className="w-full h-fit p-2">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

export default function LaneContainer({ lane }: { lane: KanbanLane }) {
  const { getCollapseState } = useCollapse();
  const collapsed = getCollapseState(lane.id);

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: lane.id,
      data: {
        type: "Lane",
        lane,
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (collapsed) {
    // w-12
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="transition-all ease-in-out duration-300 flex items-center"
      >
        <LaneContainerHeader
          listeners={listeners}
          attributes={attributes}
          id={lane.id}
          colour={lane.colour}
          name={lane.name}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="transition-all ease-in-out duration-300 bg-slate-200/50 dark:white/50 h-full rounded-lg gap-0 p-0 space-x-0 space-y-0 flex flex-col mb-2"
    >
      <LaneContainerHeader
        attributes={attributes}
        listeners={listeners}
        id={lane.id}
        colour={lane.colour}
        name={lane.name}
      />
      <LaneContainerBody tickets={lane.Tickets!} />
      <LaneContainerFooter />
    </div>
  );
}
