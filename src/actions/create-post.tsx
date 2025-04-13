"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { createPostSchema, CreatePostSchema } from "@/lib/forms";
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

    // We can now create the post!
    const post = await PostManager.create(
      {
        categoryId: category.id,
        content: values.content,
        title: values.title,
      },
      {
        ...(agencyId ? { agencyId } : { userId: user.id }),
      },
      values.tags
    );

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
