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
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./sortable-item"; // Create a SortableItem component
import Droppable from "./droppable"; // Create a Droppable component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface KanbanBoardProps {
  id: string;
}

interface Group {
  id: string;
  title: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  groupId: string;
}

const initialData = {
  todo: ["Task 1", "Task 2", "Task 3"],
  inProgress: ["Task 4"],
  done: ["Task 5"],
};

export default function KanbanBoard({ id }: KanbanBoardProps) {
  const [groups, setGroups] = useState(initialData);

  const [activeId, setActiveId] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState(null);

  const [groupName, setGroupName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const [fromGroup, fromIndex] = active.id.split(":");
    const [toGroup, toIndex] = over.id.split(":");

    if (fromGroup === toGroup) {
      // Move within the same column
      const updatedGroup = arrayMove(groups[fromGroup], +fromIndex, +toIndex);
      setGroups((prev) => ({ ...prev, [fromGroup]: updatedGroup }));
    } else {
      // Move across groups
      const fromItems = Array.from(groups[fromGroup]);
      const toItems = Array.from(groups[toGroup]);

      const [movedItem] = fromItems.splice(fromIndex, 1);
      toItems.splice(toIndex, 0, movedItem);

      setGroups((prev) => ({
        ...prev,
        [fromGroup]: fromItems,
        [toGroup]: toItems,
      }));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{id}</h1>
          <Button className="flex items-center gap-4" onClick={() => {}}>
            <PlusIcon size={15} />
            Create Lane
          </Button>
        </div>

        {/* Kanban Board (core) */}
      </div>
    </DndContext>
  );
}
