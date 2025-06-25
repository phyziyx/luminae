import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { postLikeSchema } from "@/lib/forms";
import BadgeManager from "@/lib/managers/badgeManager";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!request.bodyUsed)
    return NextResponse.json({ error: "No body" }, { status: 400 });

  const validatedFields = postLikeSchema.safeParse(body);
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

  const { type, postId } = validatedFields.data;

  // Let us first check, if the user has already (dis)liked the comment
  const existingLike = await prisma.likes.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  });

  // If the user has already liked the post,
  // we will check if the type is the same
  if (existingLike && existingLike.type === type) {
    // If the type is the same, we will remove the like
    await prisma.likes.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Post like removed successfully.",
      },
      {
        status: 200,
      }
    );
  }

  await prisma.likes.upsert({
    create: {
      type,
      postId,
      userId: user.id,
    },
    update: {
      type,
    },
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  });

  await handlePostBadge(postId);

  return NextResponse.json(
    {
      message: "Post like updated successfully.",
    },
    {
      status: 200,
    }
  );
}

async function handlePostBadge(postId: string) {
  // Reward the poster of the post with a badge when they receive >= 10 likes
  const likeCount = await prisma.likes.count({
    where: {
      postId,
      type: "LIKE",
    },
  });

  if (likeCount >= 10) {
    // Award the "Likeable Enough" badge
    const post = await prisma.post.findUnique({
      select: {
        agencyPosts: true,
        userPosts: true,
      },
      where: { id: postId },
    });

    if (post) {
      await BadgeManager.awardAchievement(
        {
          agencyId: post.agencyPosts[0]?.agencyId,
          userId: post.userPosts[0]?.userId,
        },
        "LIKEABLE_ENOUGH"
      );
    }
  }
}
