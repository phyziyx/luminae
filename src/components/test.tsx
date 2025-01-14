"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Ticket } from "@prisma/client";
import { KanbanLane } from "@/lib/types";
import CreateLaneButton from "./kanban/create-lane-button";
import { TicketCard } from "./kanban/ticket-card";
import { useKanban } from "@/providers/kanban-provider";
import LaneContainer from "./kanban/lane-container";

const POINTER_ACTIVATION_CONSTRAINT_DISTANCE = 10; // 10 px

function KanbanNew({ data }: { data: KanbanLane[] }) {
  const [lanes, setLanes] = useState<KanbanLane[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const laneIds = useMemo(() => lanes.map((lane) => lane.id) || [], [lanes]);

  const [activeLane, setActiveLane] = useState<KanbanLane | null>(null);

  const { workspaceId } = useKanban();

  useEffect(() => {
    setLanes(data);
    setTickets(data.flatMap((lane) => lane.Tickets));
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
