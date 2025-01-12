"use client";

import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";
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
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { Input } from "./ui/input";

interface Lane {
  id: string;
  name: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  laneId: string;
}

function LaneContainer({
  lane,
  deleteLane,
  updateLaneTitle,
  createTicket,
  tickets,
  deleteTicket,
}: {
  lane: Lane;
  deleteLane: (id: string) => void;
  updateLaneTitle: (id: string, title: string) => void;
  createTicket: (id: string) => void;
  tickets: Array<Ticket>;
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
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-red-200 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* Column Title */}
      <div
        {...attributes}
        {...listeners}
        className="bg-blue-200 text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-blue-500 border-4 flex flex-row justify-between items-center"
        onDoubleClick={() => setEditMode(true)}
      >
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-gray-500 px-2 py-1 text-sm rounded-full">
            {lane.id}
          </div>
          {editMode ? (
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
          )}
        </div>
        {!editMode && (
          <Button variant={"ghost"} onClick={() => deleteLane(lane.id)}>
            <Trash2Icon className="gray" />
          </Button>
        )}
      </div>

      <div className="flex flex-col flex-grow p-4 gap-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={ticketIds}>
          {tickets.map((ticket) => (
            <TaskCard
              key={ticket.id}
              ticket={ticket}
              deleteTicket={deleteTicket}
            />
          ))}
        </SortableContext>
      </div>

      <div>
        <Button onClick={() => createTicket(lane.id)}>Add a Ticket</Button>
      </div>
    </div>
  );
}

function TaskCard({
  ticket,
  deleteTicket,
}: {
  ticket: Ticket;
  deleteTicket: (id: string) => void;
}) {
  const [isHovering, setIsHovering] = useState(false);

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
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-300 p-2 h-[100px] min-h-[100px]
        items-center flex justify-between text-left rounded-xl ring-2 ring-inset
        ring-rose-500 border-2 border-gray-500
        cursor-grab relative opacity-40"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-300 p-2 h-[100px] min-h-[100px]
    items-center flex justify-between text-left rounded-xl hover:ring-2 hover:ring-inset
    hover:ring-rose-500 border-2 border-gray-500
    cursor-grab relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="text-md font-bold">{ticket.title}</div>
      {/* <div className="text-sm">{ticket.description}</div> */}
      {isHovering && (
        <Button
          variant={"ghost"}
          className="bg-transparent hover:bg-transparent opacity-60 hover:opacity-100"
          onClick={() => deleteTicket(ticket.id)}
        >
          <Trash2Icon className="text-gray-500 " />
        </Button>
      )}
    </div>
  );
}

const POINTER_ACTIVATION_CONSTRAINT_DISTANCE = 10; // 10 px

function KanbanNew() {
  const [lanes, setLanes] = useState<Lane[]>([]);
  const laneIds = useMemo(() => lanes.map((lane) => lane.id) || [], [lanes]);
  const [activeLane, setActiveLane] = useState<Lane | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: POINTER_ACTIVATION_CONSTRAINT_DISTANCE,
      },
    })
  );
  const [tickets, setTickets] = useState<Ticket[]>([]);

  function createNewLane() {
    const newLane = {
      id: Math.floor(Math.random() * 100_001).toString(),
      name: `New Lane (${lanes.length + 1})`,
    };

    setLanes((prevLanes) => [...prevLanes, newLane]);
  }

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

  function onDragOver(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveDragTask = active.data.current?.type === "Ticket";

    const isOverDragTask = over.data.current?.type === "Ticket";
    const isOverDragLane = over.data.current?.type === "Lane";

    if (!isActiveDragTask) return;

    if (isOverDragTask) {
      if (active.data.current?.ticket.laneId === overId) {
        console.log("precaution caled");
        return;
      }

      const activeTicketIndex = tickets.findIndex(
        (ticket) => ticket.id === activeId
      );

      const overTicketIndex = tickets.findIndex(
        (ticket) => ticket.id === overId
      );

      if (activeTicketIndex === -1 || overTicketIndex === -1) return;

      console.log(
        "isOverDragTask",
        over.data.current?.ticket.id,
        "laneId",
        over.data.current?.ticket.laneId
      );

      if (
        over.data.current?.ticket.laneId === active.data.current?.ticket.laneId
      ) {
        console.log("2 precaution called");
        return;
      }

      setTickets((prevTickets) => {
        prevTickets[activeTicketIndex].laneId =
          over.data.current?.ticket.laneId;

        return arrayMove(prevTickets, activeTicketIndex, overTicketIndex);

        // return [
        //   ...prevTickets.map((ticket, index) => {
        //     if (index === activeTicketIndex || index === overTicketIndex)
        //       return ticket;

        //     return {
        //       ...ticket,
        //       laneId:
        //         index === activeTicketIndex
        //           ? over.data.current?.ticket.laneId
        //           : ticket.laneId,
        //     };
        //   }),
        // ];
      });
      return;
    } else if (isOverDragLane) {
      // console.log("isOverDragLane", over.data.current?.lane.id);

      // setTickets((prevTickets) => {
      //   const activeTicketIndex = prevTickets.findIndex(
      //     (ticket) => ticket.id === activeId
      //   );
      //   prevTickets[activeTicketIndex].laneId = overId as string;
      //   return arrayMove(prevTickets, activeTicketIndex, activeTicketIndex);
      // });
      setTickets((prevTickets) => {
        const activeTicketIndex = prevTickets.findIndex(
          (ticket) => ticket.id === activeId
        );

        tickets[activeTicketIndex].laneId = overId as string;

        return arrayMove(prevTickets, activeTicketIndex, activeTicketIndex);
      });
      return;
    }

    console.error("Invalid over data type:", over.data.current?.type);
  }

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
    <div className="bg-green-500/30 m-auto min-h-full w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="bg-purple-500/30 m-auto flex gap-4">
          <div className="bg-blue-500/30 flex gap-4">
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

            <Button onClick={() => createNewLane()}>Create a Lane</Button>

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
                  <TaskCard ticket={activeTicket} deleteTicket={deleteTicket} />
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
