import prisma from "@/lib/db";
import PostManager from "@/lib/managers/postManager";
import { CategoryPost, CategoryPostsResponse } from "@/lib/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const sort = request.nextUrl.searchParams.get("sort") ?? "latest";

  if (!query || !sort || query.length < 3) {
    return NextResponse.json(
      {
        error: "Query must be at least 3 characters long and sort is required",
      },
      {
        status: 400,
      }
    );
  }

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
          type: true,
          userId: true,
        },
      },
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          comments: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
      tags: {
        ...PostManager.selectTags,
      },
      category: {
        ...PostManager.selectCategory,
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
    },
    orderBy: {
      createdAt: sort === "latest" ? "desc" : "asc",
    },
    where: {
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          content: {
            contains: query,
          },
        },
      ],
      //   deletedAt: null,
    },
  });

  const totalPosts = await prisma.post.count({
    where: {
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          content: {
            contains: query,
          },
        },
      ],
      //   deletedAt: null,
    },
  });

  const nextCursor = totalPosts > takeLimit ? posts.at(-1)?.id : undefined;
  return NextResponse.json({
    items: posts,
    nextCursor,
  } satisfies CategoryPostsResponse);
}
