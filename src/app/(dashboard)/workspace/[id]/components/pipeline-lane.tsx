import React, { useMemo } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";

import { useModal } from "@/providers/modal-provider";

import PipelineTicket from "./pipeline-ticket";
import {
  MoreVertical,
  Trash,
  Edit,
  PlusCircle as PlusCircleIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type PipelaneLaneProps = {
  setAllTickets: React.Dispatch<React.SetStateAction<any[]>>;
  allTickets: any[];
  tickets: any[];
  pipelineId: string;
  laneDetails: any;
  subaccountId: string;
  index: number;
  id: string;
};

const PipelineLane: React.FC<PipelaneLaneProps> = ({
  setAllTickets,
  tickets,
  pipelineId,
  laneDetails,
  subaccountId,
  allTickets,
  id,
}) => {
  const { openModal } = useModal();

  const amt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const laneAmt = useMemo(
    () =>
      tickets.reduce((sum, ticket) => sum + (Number(ticket?.value) || 0), 0),
    [tickets]
  );

  const randomColor = `#${Math.random().toString(16).slice(2, 8)}`;

  const addNewTicket = (ticket: any) => {
    setAllTickets([...allTickets, ticket]);
  };

  const handleCreateTicket = () => {
    // setOpen(
    //   <CustomModal
    //     title="Create A Ticket"
    //     subheading="Tickets are a great way to keep track of tasks"
    //   >
    //     <TicketForm
    //       getNewTicket={addNewTicket}
    //       laneId={laneDetails.id}
    //       subaccountId={subaccountId}
    //     />
    //   </CustomModal>
    // );
  };

  const handleEditLane = () => {
    // setOpen(
    //   <CustomModal title="Edit Lane Details" subheading="">
    //     <CreateLaneForm pipelineId={pipelineId} defaultData={laneDetails} />
    //   </CustomModal>
    // );
  };

  const handleDeleteLane = async () => {
    try {
      //   const response = await deleteLane(laneDetails.id);
      //   await saveActivityLogsNotification({
      //     agencyId: undefined,
      //     description: `Deleted a lane | ${response?.name}`,
      //     subaccountId,
      //   });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-full">
      <AlertDialog>
        <DropdownMenu>
          <div className="bg-slate-200/50 dark:white/50 h-[700px] w-[300px] px-4 relative rounded-lg flex-shrink-0">
            <div className="rounded-tr-lg rounded-tl-lg h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-500/20 absolute top-0 left-0 right-0 z-10">
              <div className="bg-white/10 h-full flex items-center p-4 justify-between cursor-grab border-b-[1px]">
                <div className="flex items-center w-full gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: randomColor }}
                  />
                  <span className="font-bold text-sm">{laneDetails.name}</span>
                </div>
                <div className="flex items-center flex-row">
                  <Badge variant={"secondary"} className="">
                    {amt.format(laneAmt)}
                  </Badge>
                  <DropdownMenuTrigger>
                    <MoreVertical className="text-muted-foreground cursor-pointer" />
                  </DropdownMenuTrigger>
                </div>
              </div>
            </div>

            <DndContext>
              <SortableContext
                items={tickets.map((ticket) => ticket.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="pt-12">
                  {tickets.map((ticket, index) => (
                    <PipelineTicket
                      allTickets={allTickets}
                      setAllTickets={setAllTickets}
                      subaccountId={subaccountId}
                      ticket={ticket}
                      key={ticket.id}
                      index={index}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AlertDialogTrigger>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Trash size={15} />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={handleEditLane}
              >
                <Edit size={15} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={handleCreateTicket}
              >
                <PlusCircleIcon size={15} />
                Create Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </div>
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
                onClick={handleDeleteLane}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </DropdownMenu>
      </AlertDialog>
    </div>
  );
};

export default PipelineLane;
