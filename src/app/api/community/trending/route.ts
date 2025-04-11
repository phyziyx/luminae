import prisma from "@/lib/db";
import { CategoryPost, CategoryPostsResponse } from "@/lib/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorParam ? cursorParam : undefined;
  const takeLimit = 10;

  const posts: CategoryPost[] = await prisma.post.findMany({
    take: takeLimit,
    skip: cursor ? 1 : undefined,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    select: {
      likes: {
        select: {
          postId: true,
          userId: true,
          type: true,
        },
      },
      id: true,
      title: true,
      content: true,
      createdAt: true,
      _count: {
        select: {
          comments: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
      agencyPosts: {
        select: {
          agency: {
            select: {
              id: true,
              name: true,
              agencyLogo: true,
            },
          },
        },
      },
      userPosts: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    where: {
      deletedAt: null,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  const totalPosts = await prisma.post.count({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const delay = 50;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return NextResponse.json({
    items: posts,
    nextCursor:
      totalPosts > takeLimit ? posts[posts.length - 1]?.id : undefined,
  } satisfies CategoryPostsResponse);
}
