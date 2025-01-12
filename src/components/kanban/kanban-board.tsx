"use client";

import { useMemo, useState } from "react";
import { CollapseProvider } from "./collapse-provider";
import CreateLaneButton from "./create-lane-button";
import LaneContainer from "./lane-container/lane-container";
import { DndContext, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { KanbanLane } from "@/lib/types";

interface KanbanBoardProps {
  workspaceId: string;
  name: string;
}

export default function KanbanBoard({ workspaceId }: KanbanBoardProps) {
  const { useKanbanBoardQuery } = useKanban();
  const kanbanBoardQuery = useKanbanBoardQuery(workspaceId);

  const laneIds = useMemo(() => {
    return kanbanBoardQuery.data?.map((lane) => lane.id) || [];
  }, [kanbanBoardQuery.data]);
  const [activeLane, setActiveLane] = useState<KanbanLane | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    console.log("dragging started", event);

    if (event.active.data.current?.type === "Lane") {
      setActiveLane(event.active.data.current.lane);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    console.log("dragging ended", event);
    setActiveLane(null);
  };

  return (
    <div className="w-[90%] h-screen px-[10px] gap-2 overflow-y-hidden">
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="m-auto w-full flex flex-row gap-2 overflow-x-auto overflow-y-visible min-h-dvh">
          <CollapseProvider>
            {kanbanBoardQuery.isLoading && <div>Loading...</div>}
            <SortableContext items={laneIds}>
              <>
                {kanbanBoardQuery.data &&
                  kanbanBoardQuery.data.map((lane) => {
                    return <LaneContainer key={lane.id} lane={lane} />;
                  })}
                {/* <CollapseButtons /> */}
              </>
            </SortableContext>
            {activeLane &&
              createPortal(<LaneContainer lane={activeLane} />, document.body)}
          </CollapseProvider>
          <CreateLaneButton workspaceId={workspaceId} />
        </div>
      </DndContext>
    </div>
  );
}
