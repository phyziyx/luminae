import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const workspaceId = (await params).workspaceId;

  if (!workspaceId) {
    return new NextResponse("Workspace ID is required", { status: 400 });
  }

  const lanes = await prisma.lane.findMany({
    select: {
      colour: true,
      id: true,
      name: true,
      order: true,
      Tickets: {
        select: {
          title: true,
          assigneeUserId: true,
          Client: true,
          assigneeUser: true,
          clientId: true,
          id: true,
          description: true,
          laneId: true,
          createdAt: true,
          open: true,
          tag: true,
          value: true,
        },
      },
    },
    where: {
      workspaceId: workspaceId,
    },
  });

  console.table(lanes);

  return NextResponse.json(lanes);
}
