import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import AgencyManager from "@/lib/managers/agencyManager";
import { PostCommentResponse } from "@/lib/types";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        error: "Comment id is required",
      },
      {
        status: 400,
      }
    );
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      {
        error: "You are not logged in",
      },
      {
        status: 401,
      }
    );
  }

  const comment = await prisma.comment.findFirst({
    where: {
      id,
    },
    include: {
      userComments: {
        select: {
          userId: true,
          user: {
            select: {
              id: true,
            },
          },
        },
      },
      agencyComments: {
        select: {
          agencyId: true,
          agency: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!comment) {
    return NextResponse.json(
      {
        error: "Comment not found",
      },
      {
        status: 404,
      }
    );
  }

  if (
    comment.agencyComments.length === 0 &&
    comment.userComments.length === 0
  ) {
    return NextResponse.json(
      {
        error: "Weird situation, comment not found",
      },
      {
        status: 404,
      }
    );
  }

  if (comment.userComments.length > 0) {
    const userId = comment.userComments[0].userId;
    if (userId !== comment.userComments[0].user.id) {
      return NextResponse.json(
        {
          error: "You are not allowed to delete this comment",
        },
        {
          status: 403,
        }
      );
    }
  }

  if (comment.agencyComments.length > 0) {
    const agencyId = comment.agencyComments[0].agencyId;
    const agencyMember = await AgencyManager.findUserAgency(user.email);
    if (agencyId !== agencyMember?.agencyId) {
      return NextResponse.json(
        {
          error: "You are not allowed to delete this comment",
        },
        {
          status: 403,
        }
      );
    }
  }

  await prisma.userComment.deleteMany({
    where: {
      commentId: id,
    },
  });

  await prisma.agencyComment.deleteMany({
    where: {
      commentId: id,
    },
  });

  await prisma.comment.deleteMany({
    where: {
      id,
    },
  });

  return NextResponse.json(
    {
      message: "Comment deleted",
    },
    {
      status: 200,
    }
  );
}

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
