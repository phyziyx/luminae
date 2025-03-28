import prisma from "@/lib/db";
import { PostCommentResponse } from "@/lib/types";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("postId");

  if (!id) {
    return NextResponse.json(
      {
        error: "Post id is required",
      },
      {
        status: 400,
      }
    );
  }

  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorParam ? cursorParam : undefined;
  const takeLimit = 10;

  const comments = await prisma.comment.findMany({
    take: takeLimit,
    skip: cursor ? 1 : undefined,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    select: {
      id: true,
      postId: true,
      content: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      postId: id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalComments = await prisma.comment.count({
    where: {
      postId: id,
      deletedAt: null,
    },
  });

  return NextResponse.json({
    items: comments,
    nextCursor: totalComments > takeLimit ? comments.at(-1)?.id : null,
  } satisfies PostCommentResponse);
}
