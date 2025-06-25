"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { commentFormSchema, CommentFormSchema } from "@/lib/forms";
import BadgeManager from "@/lib/managers/badgeManager";
import PostManager from "@/lib/managers/postManager";

export default async function onSubmitComment(values: CommentFormSchema) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: "A user who is not authenticated tried to submit a comment...",
    };
  }

  const validatedFields = commentFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  try {
    // This is an optimisation to only select one field,
    // as opposed to more (or all) if we only want to
    // verify whether the post exists or not
    //
    // - phyziyx
    const post = await PostManager.doesPostExist(values.postId);

    if (!post) {
      return { error: "Post not found" };
    }

    if (values.parentId) {
      // Looks like we've an optional parentId provided
      // So we need to verify whether the parent comment
      // exists or not
      //
      // - phyziyx
      const parentComment = await PostManager.doesCommentExist(values.parentId);

      if (!parentComment) {
        return { error: "Parent comment not found" };
      }
    }

    let agencyId: string | undefined = undefined;
    if (values.asAgency) {
      // If the comment is being posted as an agency.
      agencyId = (
        await prisma.agencyMember.findFirst({
          select: {
            agencyId: true,
          },
          where: {
            user: {
              id: user.id,
            },
          },
        })
      )?.agencyId;
    }

    // We can now create the comment!
    const comment = await PostManager.createComment(
      {
        content: values.content,
        postId: values.postId,
        parentId: values.parentId || null,
      },
      {
        ...(agencyId ? { agencyId } : { userId: user.id }),
      }
    );

    await handleCommentBadge(agencyId, user.id);

    return {
      comment,
    };
  } catch (err) {
    console.log(err);

    return {
      error: "An error occurred while creating comment...",
    };
  }
}

async function handleCommentBadge(
  agencyId: string | undefined,
  userId: string
): Promise<void> {
  const profile = await prisma.profile.findFirst({
    where: agencyId
      ? { agencyProfile: { agencyId } }
      : { userProfile: { userId } },
  });

  if (!profile) return;

  const count = await PostManager.getCommentCountForProfile(profile.id);
  const target = agencyId ? { agencyId } : { userId };

  if (count >= 1) {
    BadgeManager.awardAchievement(target, "CHATTER_BOX");
  }
}
