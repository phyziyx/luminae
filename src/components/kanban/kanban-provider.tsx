"use client";

import { createContext, useContext } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import onCreateLane from "@/actions/create-lane";
import { CreateLaneSchema } from "@/lib/forms";
import { KanbanLane } from "@/lib/types";

interface KanbanContextType {
  useKanbanBoardQuery: (
    workspaceId: string
  ) => UseQueryResult<KanbanLane[], Error>;
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
      queryFn: async () => {
        const response = await fetch(`/api/kanban/${workspaceId}/`);

        if (!response.ok) {
          throw new Error("An error occurred while fetching the data");
        }

        return response.json();
      },
    });
  }

  function useCreateLaneMutation() {
    // const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (lane: CreateLaneSchema) => onCreateLane(lane),
      // onSettled: () => {
      //   queryClient.invalidateQueries({
      //     queryKey: ["kanban-board", workspaceId],
      //   });
      // },
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
