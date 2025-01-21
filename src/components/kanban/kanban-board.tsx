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
import CreateLaneButton from "./create-lane-button";
import { TicketCard } from "./ticket-card";
import { useKanban } from "@/providers/kanban-provider";
import LaneContainer from "./lane-container";
import updateLaneOrder from "@/actions/update-lane-order";
import updateTicketOrder from "@/actions/update-ticket-order";

const POINTER_ACTIVATION_CONSTRAINT_DISTANCE = 10; // 10 px

function KanbanBoard({ data }: { data: KanbanLane[] }) {
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

  const ticketDragRef = useRef<{
    ticket: unknown;
    originalLaneId: string;
  } | null>(null);

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
      ticketDragRef.current = {
        ticket: event.active.data.current.ticket,
        originalLaneId: event.active.data.current.ticket.laneId,
      };
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

    console.log(
      "[onDragEnd]\n\
      activeId:",
      activeId,
      "activeType",
      active.data.current?.type,
      "overId:",
      overId,
      "overType",
      over.data.current?.type
    );

    if (ticketDragRef.current) {
      const activeTicketIndex = tickets.findIndex(
        (ticket) => ticket.id === activeId
      );

      const isMoveTypeLane = over.data.current?.type === "Lane";

      const overIndex = isMoveTypeLane
        ? lanes.findIndex((lane) => lane.id === overId)
        : tickets.findIndex((ticket) => ticket.id === overId);

      if (isMoveTypeLane) {
        console.log("Move to lane");
      } else {
        console.log("Move between ticket");
      }

      if (activeTicketIndex !== -1 && overIndex !== -1) {
        updateTicketOrder(tickets);
      }
      return;
    }

    ticketDragRef.current = null;

    if (activeId === overId) {
      return;
    }

    if (active.data.current?.type === "Lane") {
      const activeLaneIndex = lanes.findIndex((lane) => lane.id === activeId);
      const overLaneIndex = lanes.findIndex((lane) => lane.id === overId);

      if (activeLaneIndex === -1 || overLaneIndex === -1) {
        return;
      }

      const newLanes = lanes
        .toSpliced(activeLaneIndex, 1)
        .toSpliced(overLaneIndex, 0, lanes[activeLaneIndex])
        .map((lane, idx) => {
          return { ...lane, order: idx };
        });

      updateLaneOrder(newLanes);
      setLanes(newLanes);

      return;
    }

    console.error("Invalid active data type:", active.data.current?.type);
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

        const newTickets = arrayMove(
          ticketsCopy,
          activeTicketIndex,
          overTicketIndex
        ).map((ticket, idx) => {
          return { ...ticket, order: idx };
        });
        console.log(
          JSON.stringify(
            newTickets.map((ticket) => ({
              title: ticket.title,
              order: ticket.order,
            })),
            null,
            2
          )
        );

        return newTickets;
      });
      return;
    }
  };

  function deleteTicket(id: string) {
    setTickets((prevTickets) =>
      prevTickets.filter((ticket) => ticket.id !== id)
    );
  }

  const ticketsByLane = useMemo(() => {
    return lanes.map((lane) => ({
      laneId: lane.id,
      tickets: tickets
        .filter((ticket) => ticket.laneId === lane.id)
        .sort((a, b) => a.order - b.order),
    }));
  }, [lanes, tickets]);

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
                  tickets={
                    ticketsByLane.find((e) => e.laneId === lane.id)?.tickets ||
                    []
                  }
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
                    tickets={
                      ticketsByLane.find((e) => e.laneId === activeLane.id)
                        ?.tickets || []
                    }
                    deleteTicket={deleteTicket}
                  />
                )}
                {activeTicket && <TicketCard ticket={activeTicket} />}
              </DragOverlay>,
              document.body
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
