"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { backendClient } from "@/lib/edgestore/edgestore";
import { createPostSchema, CreatePostSchema } from "@/lib/forms";
import BadgeManager from "@/lib/managers/badgeManager";
import PostManager from "@/lib/managers/postManager";

export default async function onCreatePost(values: CreatePostSchema) {
  const session = await getSession();
  const user = session?.user;

  let error = "An error occurred while creating comment...";

  if (!user) {
    error = "A user who is not authenticated tried to submit a comment...";
    return { error };
  }

  const validatedFields = createPostSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  try {
    const category = await prisma.category.findFirst({
      select: {
        id: true,
      },
      where: {
        name: values.category,
      },
    });

    if (!category) {
      error = "Category not found";
      return { error };
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

    const file = values.image as File | FileList | null;
    let fileUrl: string | null = null;
    if (file) {
      const fileToStore =
        file instanceof File ? file : file instanceof FileList ? file[0] : null;

      if (fileToStore) {
        const bytes = await fileToStore.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileBlob = new Blob([buffer], { type: fileToStore.type });

        try {
          const response = await backendClient.publicFiles.upload({
            content: {
              blob: fileBlob,
              extension: fileToStore.type,
            },
            options: {
              manualFileName: undefined,
              replaceTargetUrl: `post-${agencyId ? "agency" : "user"}`,
              temporary: false,
            },
            ctx: {
              userId: (agencyId ? agencyId : user.id) as string,
              userRole: "visitor",
            },
            input: {
              type: "post",
            },
          });

          fileUrl = response.url;
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          error = "An error occurred while uploading the file.";
          return { error };
        }
      }
    }

    // We can now create the post!
    const post = await PostManager.create(
      {
        categoryId: category.id,
        content: values.content,
        title: values.title,
        image: fileUrl,
      },
      {
        ...(agencyId ? { agencyId } : { userId: user.id }),
      },
      values.tags
    );

    // Let us now count how many posts the user has created, so we can award them a badge if they have created enough posts.
    const count = await PostManager.getCountForProfile(user.id);
    if (count >= 3) {
      BadgeManager.awardAchievement(
        agencyId
          ? { agencyId }
          : {
              userId: user.id,
            },
        "OUT_OF_SHADOWS"
      );
    }
    if (count >= 1) {
      BadgeManager.awardAchievement(
        agencyId
          ? { agencyId }
          : {
              userId: user.id,
            },
        "FIRST_WORD"
      );
    }

    error = "";
    return {
      error,
      post: `/community/${values.category}/${post.id}`,
    };
  } catch (err) {
    console.log(err);

    error = "An error occurred while creating post...";
  }

  return {
    error,
  };
}
