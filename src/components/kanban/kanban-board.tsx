"use client";

import { CollapseProvider } from "./collapse-provider";
import CreateLaneButton from "./create-lane-button";
import { useKanban } from "./kanban-provider";
import LaneContainer from "./lane-container/container";

interface KanbanBoardProps {
  workspaceId: string;
  name: string;
}

export default function KanbanBoard({ workspaceId }: KanbanBoardProps) {
  const { useKanbanBoardQuery } = useKanban();

  const kanbanBoardQuery = useKanbanBoardQuery(workspaceId);

  return (
    <div className="w-[90%] h-screen px-[10px] gap-2 overflow-y-hidden">
      <div className="m-auto w-full flex flex-row gap-2 overflow-x-auto overflow-y-visible min-h-dvh">
        <CollapseProvider>
          {kanbanBoardQuery.isLoading && <div>Loading...</div>}
          {kanbanBoardQuery.data &&
            kanbanBoardQuery.data.map((lane) => (
              <LaneContainer key={lane.id} lane={lane} />
            ))}
          {/* <CollapseButtons /> */}
        </CollapseProvider>
        <CreateLaneButton workspaceId={workspaceId} />
      </div>
    </div>
  );
}
