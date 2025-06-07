import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { AgencyVerificationResponse } from "@/lib/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const appId = request.nextUrl.searchParams.get("appId");

  const cursor = appId ? appId : undefined;
  const takeLimit = 10;

  const [apps, totalApps] = await Promise.all([
    prisma.agencyVerification.findMany({
      take: takeLimit,
      skip: cursor ? 1 : undefined,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.agencyVerification.count(),
  ]);

  const nextCursor = totalApps > takeLimit ? apps.at(-1)?.id : undefined;
  const prevCursor = cursor ? apps.at(0)?.id : undefined;

  return NextResponse.json({
    items: apps,
    nextCursor,
    prevCursor,
  } satisfies AgencyVerificationResponse);
}
