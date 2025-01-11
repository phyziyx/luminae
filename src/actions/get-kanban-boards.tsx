"use server";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

/*
[
    {
      id: "1",
      name: "Column 1",
      order: 1,
      workspaceId,
      colour: "#ff00ff",
    },
    {
      id: "2",
      name: "Column 2",
      order: 2,
      workspaceId,
      colour: "#ff3300",
    },
    {
      id: "3",
      name: "Column 3",
      order: 3,
      workspaceId,
      colour: "#33ff00",
    },
    {
      id: "4",
      name: "Column 4",
      order: 4,
      workspaceId,
      colour: "#000088",
    },
    {
      id: "5",
      name: "Column 5",
      order: 5,
      workspaceId,
      colour: "#660066",
    },
    {
      id: "6",
      name: "Column 6",
      order: 6,
      workspaceId,
      colour: "#55BBAA",
    },
  ];
  */

export default async function getKanbanBoard(workspaceId: string) {
  // const user = await currentUser();

  const lanes = await prisma.lane.findMany({
    where: {
      workspaceId: workspaceId,
    },
  });

  return lanes;
}
