"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LightbulbIcon,
  LightbulbOff,
  PlusIcon,
  PresentationIcon,
} from "lucide-react";
import { User } from "@prisma/client";
import PipelineLane from "./pipeline-lane";
import { Badge } from "@/components/ui/badge";

interface KanbanBoardProps {
  id: string;
  name: string;
  data: any;
}

type Contact = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  subAccountId: string;
};

type Tag = {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  subAccountId: string;
};

interface Lane {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  pipelineId: string;
  order: number;
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

type TicketAndTags = Ticket & {
  tags: Tag[];
  assigned: User | null;
  customer: Contact | null;
};

type LaneDetail = Lane & {
  tickets: TicketAndTags[];
};

export default function KanbanBoard({ id, data, name }: KanbanBoardProps) {
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([
    {
      createdAt: new Date(),
      id: "0",
      name: "Backlog",
      order: 0,
      pipelineId: "1",
      updatedAt: new Date(),
      tickets: [],
    },
    {
      createdAt: new Date(),
      id: "1",
      name: "To Do",
      order: 0,
      pipelineId: "1",
      updatedAt: new Date(),
      tickets: [
        {
          id: "1",
          name: "Ticket 1",
          description: "Description 1",
          tags: [],
          assignedUserId: null,
          customerId: null,
          assigned: null,
          createdAt: new Date(),
          customer: null,
          laneId: "1",
          order: 0,
          updatedAt: new Date(),
          value: null,
        },
        {
          id: "2",
          name: "Ticket 2",
          description: "Description 2",
          tags: [
            {
              color: "red",
              createdAt: new Date(),
              id: "1",
              name: "Urgent",
              subAccountId: "1",
              updatedAt: new Date(),
            },
          ],
          assigned: null,
          customer: null,
          assignedUserId: null,
          createdAt: new Date(),
          customerId: null,
          laneId: "1",
          order: 0,
          updatedAt: new Date(),
          value: null,
        },
      ],
    },
    {
      createdAt: new Date(),
      id: "2",
      name: "Recurring",
      order: 0,
      pipelineId: "2",
      updatedAt: new Date(),
      tickets: [],
    },
    {
      createdAt: new Date(),
      id: "3",
      name: "Progress",
      order: 0,
      pipelineId: "3",
      updatedAt: new Date(),
      tickets: [],
    },
    {
      createdAt: new Date(),
      id: "4",
      name: "Completed",
      order: 0,
      pipelineId: "4",
      updatedAt: new Date(),
      tickets: [],
    },
    {
      createdAt: new Date(),
      id: "5",
      name: "Archived",
      order: 0,
      pipelineId: "5",
      updatedAt: new Date(),
      tickets: [],
    },
  ]);

  const ticketsFromAllLanes: TicketAndTags[] = [];
  allLanes.forEach((item) => {
    item.tickets.forEach((i) => {
      ticketsFromAllLanes.push(i);
    });
  });
  const [allTickets, setAllTickets] = useState(ticketsFromAllLanes);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateLanesOrder = (lanes: LaneDetail[]) => {
    // Update the order of lanes in the database
    setAllLanes(lanes);
  };

  const updateTicketsOrder = async (tickets: Ticket[]) => {
    // Update the order of tickets in the database
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isLane = active.data.current?.type === "lane";

    if (isLane) {
      const oldIndex = allLanes.findIndex((lane) => lane.id === activeId);
      const newIndex = allLanes.findIndex((lane) => lane.id === overId);

      const newLanes = arrayMove(allLanes, oldIndex, newIndex).map(
        (lane, idx) => ({ ...lane, order: idx })
      );
      setAllLanes(newLanes);
      updateLanesOrder(newLanes);
    } else {
      const sourceLaneId = active.data.current?.laneId;
      const destinationLaneId = over.data.current?.laneId;

      if (!sourceLaneId || !destinationLaneId) return;

      const sourceLane = allLanes.find((lane) => lane.id === sourceLaneId);
      const destinationLane = allLanes.find(
        (lane) => lane.id === destinationLaneId
      );

      if (!sourceLane || !destinationLane) return;

      const sourceTickets = sourceLane.tickets;
      const destinationTickets = destinationLane.tickets;

      const oldIndex = sourceTickets.findIndex(
        (ticket) => ticket.id === activeId
      );
      const newIndex = overId ? destinationTickets.length : 0;

      if (sourceLaneId === destinationLaneId) {
        const updatedTickets = arrayMove(sourceTickets, oldIndex, newIndex).map(
          (ticket, idx) => ({ ...ticket, order: idx })
        );
        sourceLane.tickets = updatedTickets;
        setAllLanes([...allLanes]);
        updateTicketsOrder(updatedTickets);
      } else {
        const [movedTicket] = sourceTickets.splice(oldIndex, 1);
        movedTicket.laneId = destinationLaneId;

        sourceTickets.forEach((ticket, idx) => (ticket.order = idx));
        destinationTickets.splice(newIndex, 0, movedTicket);
        destinationTickets.forEach((ticket, idx) => (ticket.order = idx));

        setAllLanes([...allLanes]);
        updateTicketsOrder([...sourceTickets, ...destinationTickets]);
      }
    }
  };

  const myTasksCount = allTickets.filter(
    (ticket) => ticket.assignedUserId === "1"
  ).length;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="flex flex-row items-center gap-2">
            <Badge variant={"secondary"} className="flex items-center gap-2">
              {myTasksCount !== 0 ? (
                <LightbulbOff />
              ) : (
                <>
                  You have {myTasksCount} tasks!
                  <LightbulbIcon />
                </>
              )}
            </Badge>
          </p>
          <Button className="flex items-center gap-4" onClick={() => {}}>
            <PlusIcon size={15} />
            Create Lane
          </Button>
        </div>

        {/* Kanban Board (core) */}
        <div className="flex flex-wrap gap-y-2 item-center gap-x-2">
          <DndContext>
            <SortableContext
              items={allLanes.map((lane) => lane.id)}
              strategy={rectSortingStrategy}
            >
              {allLanes.map((lane, index) => (
                <PipelineLane
                  key={lane.id}
                  id={lane.id}
                  allTickets={allTickets}
                  setAllTickets={setAllTickets}
                  subaccountId={"1"}
                  pipelineId={"1"}
                  tickets={lane.tickets}
                  laneDetails={lane}
                  index={index}
                />
              ))}
            </SortableContext>
          </DndContext>
          {allLanes.length === 0 && (
            <div className="flex items-center justify-center w-full flex-col">
              <div className="opacity-100">
                <PresentationIcon
                  width="100%"
                  height="100%"
                  className="text-muted-foreground"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}
