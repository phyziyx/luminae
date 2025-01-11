"use client";

import { createContext, useContext } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import getKanbanBoard from "@/actions/get-kanban-boards";
import onCreateLane from "@/actions/create-lane";
import { CreateLaneSchema } from "@/lib/forms";

interface KanbanContextType {
  useKanbanBoardQuery: (workspaceId: string) => UseQueryResult<
    {
      id: string;
      name: string;
      order: number;
      colour: string;
      workspaceId: string;
    }[],
    Error
  >;
  useCreateLaneMutation: () => UseMutationResult<
    {
      error: string;
    },
    Error,
    {
      name: string;
      colour: string;
      id?: string | undefined;
    },
    unknown
  >;
  // Define other properties here...
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}) {
  function useKanbanBoardQuery() {
    return useQuery({
      queryKey: ["kanban-board", workspaceId],
      queryFn: () => getKanbanBoard(workspaceId),
    });
  }

  function useCreateLaneMutation() {
    return useMutation({
      mutationFn: (lane: CreateLaneSchema) => onCreateLane(lane),
    });
  }

  // Define other functions here...

  return (
    <KanbanContext.Provider
      value={{ useKanbanBoardQuery, useCreateLaneMutation }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
}
