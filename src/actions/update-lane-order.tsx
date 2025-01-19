"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function updateLaneOrder(
  lanes: { id: string; order: number }[]
) {
  await prisma.$transaction(
    lanes.map((lane) =>
      prisma.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      })
    )
  );

  console.log("Lane order updated!");

  revalidatePath("/");
}
