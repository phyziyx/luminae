"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useContext } from "react";

interface CollapseContextType {
  getCollapseState: (laneId: string) => boolean;
  toggleCollapse: (laneId: string) => void;
  //
  collapseNone: () => void;
  collapseAll: () => void;
}

const CollapseContext = createContext<CollapseContextType | undefined>(
  undefined
);

export function CollapseProvider({ children }: { children: React.ReactNode }) {
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
    <CollapseContext.Provider
      value={{ getCollapseState, toggleCollapse, collapseNone, collapseAll }}
    >
      {children}
    </CollapseContext.Provider>
  );
}

export function useCollapse() {
  const context = useContext(CollapseContext);

  if (context === undefined) {
    throw new Error("useCollapse must be used within a CollapseProvider");
  }

  return context;
}
