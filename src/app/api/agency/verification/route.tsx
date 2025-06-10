import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { AgencyVerificationResponse, InfiniteQueryResponse } from "@/lib/types";
import { NextResponse, type NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const limit = 10;

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const offset = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.agencyVerification.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: "desc" },
      where: {
        ...(query
          ? {
              notes: { contains: query },
            }
          : {}),
      },
    }),
    prisma.agencyVerification.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    items,
    meta: {
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  } satisfies AgencyVerificationResponse);
}
