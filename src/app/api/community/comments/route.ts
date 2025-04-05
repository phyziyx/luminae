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
      parentId: true,
      postId: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      agencyComments: {
        select: {
          agencyId: true,
          agency: {
            select: {
              id: true,
              name: true,
              agencyLogo: true,
            },
          },
        },
      },
      userComments: {
        select: {
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      likes: {
        select: {
          commentId: true,
          type: true,
          userId: true,
        },
      },
      // children: {
      //   include: {
      //     author: {
      //       select: {
      //         id: true,
      //         name: true,
      //         image: true,
      //       },
      //     },
      //     likes: {
      //       select: {
      //         commentId: true,
      //         type: true,
      //         userId: true,
      //       },
      //     },
      //   },
      // },
    },
    where: {
      postId: id,
      // parentId: null,
      // deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalComments = await prisma.comment.count({
    where: {
      postId: id,
      // parentId: null,
      // deletedAt: null,
    },
  });

  const nextCursor = totalComments > takeLimit ? comments.at(-1)?.id : null;

  return NextResponse.json({
    items: comments,
    nextCursor,
  } satisfies PostCommentResponse);
}
