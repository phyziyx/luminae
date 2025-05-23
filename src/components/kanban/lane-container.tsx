import React, { useActionState } from "react";
import { Button } from "../ui/button";
import {
  CalendarIcon,
  ChevronRightIcon,
  Circle,
  EditIcon,
  Link2Icon,
  MoreVerticalIcon,
  PlusCircleIcon,
  Trash2Icon,
  User2Icon,
} from "lucide-react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "../site/custom-modal";
import clsx from "clsx";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
} from "../ui/alert-dialog";
import { KanbanLane, LaneTicket } from "@/lib/types";
import { LoadingSpinner } from "../site/loading-spinner";
import deleteLane from "@/actions/delete-lane";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { TicketCard } from "./ticket-card";
import LaneCreateModal from "../kanban/lane-form";
import LaneTicketModal from "./lane-ticket-form";
import { useKanban } from "@/providers/kanban-provider";
// import { useKanban } from "@/providers/kanban-provider";

function LaneContainerFooter({
  laneId,
  workspaceId,
}: {
  laneId: string;
  workspaceId: string;
}) {
  const { openModal } = useModal();
  // const { workspaceId } = useKanban();

  return (
    <div className="rounded-bl-lg rounded-br-lg h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 z-10">
      <div className="bg-white/10 h-full flex items-center p-4 justify-between border-t-[1px]">
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
                  <LaneTicketModal
                    workspaceId={workspaceId}
                    laneId={laneId}
                    ticketId=""
                  />
                </CustomModal>
              );
            }}
          >
            Add a Ticket...
          </Button>
        </div>
        <div className="flex items-center flex-row">
          <CalendarIcon className="text-muted-foreground" />
          <User2Icon className="text-muted-foreground" />
          <Link2Icon className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function LaneContainerBody({
  tickets,
  ticketIds,
}: {
  tickets: Array<LaneTicket>;
  ticketIds: Array<string>;
}) {
  return (
    <div className="flex flex-col flex-grow p-4 gap-2 overflow-x-hidden overflow-y-auto">
      <SortableContext items={ticketIds}>
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </SortableContext>
    </div>
  );
}

export default function LaneContainer({
  lane,
  deleteLane,
  updateLaneTitle,
  tickets,
}: {
  lane: KanbanLane;
  deleteLane: (id: string) => void;
  updateLaneTitle: (id: string, title: string) => void;
  tickets: Array<LaneTicket>;
  deleteTicket: (id: string) => void;
}) {
  const [editMode, setEditMode] = React.useState(false);

  // const { getCollapseState } = useKanban();
  // const collapsed = getCollapseState(lane.id);
  // if (collapsed) {
  //   // w-12
  //   return (
  //     <div className="transition-all ease-in-out duration-300 flex items-center">
  //       <LaneContainerHeader
  //         id={lane.id}
  //         colour={lane.colour}
  //         name={lane.name}
  //       />
  //     </div>
  //   );
  // }

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

  const ticketIds = React.useMemo(
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

      <LaneContainerBody tickets={tickets} ticketIds={ticketIds} />

      <LaneContainerFooter laneId={lane.id} workspaceId={lane.workspaceId} />
    </div>
  );
}

function LaneContainerHeader({
  attributes,
  listeners,
  editMode,
  lane,
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

  const laneValue = React.useMemo(
    () => lane.tickets.reduce((acc, ticket) => acc + ticket.value, 0),
    [lane.tickets]
  );

  const { manager, getCollapseState } = useKanban();
  const collapsed = getCollapseState(lane.id);

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
        title={t("KANBAN.EDIT_LANE_TITLE")}
        caption={t("KANBAN.EDIT_LANE_CAPTION")}
      >
        <LaneCreateModal
          workspaceId={lane.workspaceId}
          lane={{
            order: 0,
            id: lane.id,
            workspaceId: lane.workspaceId,
            name: lane.name,
            colour: lane.colour,
          }}
        />
      </CustomModal>
    );
  }

  React.useEffect(() => {
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
      <DropdownMenu modal={false}>
        <div
          {...attributes}
          {...listeners}
          className="backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 z-10
		rounded-lg rounded-b-none border-b-[1px]
		text-md h-[60px] cursor-grab p-2 font-bold flex flex-row gap-2 items-center place-items-center"
          // onDoubleClick={() => setEditMode(!collapsed && true)}
          // onBlur={() => setEditMode(false)}
          // className={clsx(
          //   "whitespace-nowrap hover:cursor-text font-bold text-sm",
          //   {
          //     "w-0 rotate-90": collapsed,
          //   }
          // )}
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
                // onClick={() => toggleCollapse(lane.id)}
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
              {lane.name}
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
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "USD",
                  }).format(+laneValue)}
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

          {manager && (
            <>
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
            </>
          )}
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => {
              openModal(
                <CustomModal
                  title="Add a Ticket"
                  caption="Add a ticket to the lane"
                >
                  <LaneTicketModal
                    workspaceId={lane.workspaceId}
                    laneId={lane.id}
                    ticketId=""
                  />
                </CustomModal>
              );
            }}
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
