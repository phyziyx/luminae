"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useContext } from "react";

type KanbanData = {
  getCollapseState: (laneId: string) => boolean;
  toggleCollapse: (laneId: string) => void;
  //
  collapseNone: () => void;
  collapseAll: () => void;
  //
  workspaceId: string;
  agencyId: string;
  manager: boolean;
};

const KanbanContext = createContext<undefined | KanbanData>(undefined);

export function KanbanProvider({
  workspaceId,
  agencyId,
  manager,
  children,
}: {
  workspaceId: string;
  agencyId: string;
  manager: boolean;
  children: React.ReactNode;
}) {
  // The collapsed state should be saved in the localStorage
  // and then checked if valid, then set the state
  const [collapsedState, setCollapsedState] = useLocalStorage<
    Record<string, boolean>
  >("collapsedState", {});

  const toggleCollapse = (laneId: string) => {
    setCollapsedState((prevState) => ({
      ...prevState,
      [laneId]: !prevState[laneId],
    }));
  };

  const getCollapseState = (laneId: string) => {
    return collapsedState[laneId] || false;
  };

  const collapseNone = () => {
    setCollapsedState((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((key) => {
        newState[key] = false;
      });
      return newState;
    });
  };

  const collapseAll = () => {
    setCollapsedState((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((key) => {
        newState[key] = true;
      });
      return newState;
    });
  };

  return (
    <KanbanContext.Provider
      value={{
        workspaceId,
        agencyId,
        manager,
        getCollapseState,
        toggleCollapse,
        collapseNone,
        collapseAll,
      }}
    >
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
