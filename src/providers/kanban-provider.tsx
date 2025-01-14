"use client";

import { createContext, useContext } from "react";

type KanbanData = {
  workspaceId: string;
  agencyId: string;
};

const KanbanContext = createContext<undefined | KanbanData>(undefined);

export function KanbanProvider({
  workspaceId,
  agencyId,
  children,
}: {
  workspaceId: string;
  agencyId: string;
  children: React.ReactNode;
}) {
  return (
    <KanbanContext.Provider value={{ workspaceId, agencyId }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const kanbanContext = useContext(KanbanContext);

  if (kanbanContext === undefined) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }

  return kanbanContext;
}
