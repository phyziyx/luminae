import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const workspaceId = (await params).workspaceId;

  if (!workspaceId) {
    return new NextResponse("Workspace ID is required", { status: 400 });
  }

  const lanes = await prisma.lane.findMany({
    where: {
      workspaceId: workspaceId,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      tickets: {
        // orderBy: {
        //   order: "asc",
        // },
        include: {
          assigneeUser: true,
          client: true,
        },
      },
    },
  });

  return NextResponse.json(lanes);
}
