import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { commentLikeSchema } from "@/lib/forms";
import BadgeManager from "@/lib/managers/badgeManager";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!request.bodyUsed)
    return NextResponse.json({ error: "No body" }, { status: 400 });

  const validatedFields = commentLikeSchema.safeParse(body);
  if (!validatedFields.success) {
    return NextResponse.json(
      {
        error: "Invalid fields provided.",
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
        error: "User not authenticated.",
      },
      {
        status: 401,
      }
    );
  }

  const { type, commentId } = validatedFields.data;

  // Let us first check, if the user has already (dis)liked the comment
  const existingLike = await prisma.commentLikes.findUnique({
    where: {
      userId_commentId: {
        userId: user.id,
        commentId,
      },
    },
  });

  // If the user has already liked the comment,
  // we will check if the type is the same
  if (existingLike && existingLike.type === type) {
    // If the type is the same, we will remove the like
    await prisma.commentLikes.delete({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Comment like removed successfully.",
      },
      {
        status: 200,
      }
    );
  }

  await prisma.commentLikes.upsert({
    create: {
      type,
      commentId,
      userId: user.id,
    },
    update: {
      type,
    },
    where: {
      userId_commentId: {
        userId: user.id,
        commentId,
      },
    },
  });

  await handleCommentBadge(commentId);

  return NextResponse.json(
    {
      message: "Comment like updated successfully.",
    },
    {
      status: 200,
    }
  );
}

async function handleCommentBadge(commentId: string) {
  // Reward the poster of the comment with a badge when they receive >= 10 likes
  const likeCount = await prisma.commentLikes.count({
    where: {
      commentId,
      type: "LIKE",
    },
  });

  if (likeCount >= 10) {
    // Award the "Likeable Enough" badge
    const comment = await prisma.comment.findUnique({
      select: {
        agencyComments: true,
        userComments: true,
      },
      where: { id: commentId },
    });

    if (comment) {
      await BadgeManager.awardAchievement(
        {
          agencyId: comment.agencyComments[0]?.agencyId,
          userId: comment.userComments[0]?.userId,
        },
        "LIKEABLE_ENOUGH"
      );
    }
  }
}
