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

  if (!user) {
    return {
      error: "A user who is not authenticated tried to submit a comment...",
    };
  }

  const validation = createPostSchema.safeParse(values);
  if (!validation.success) {
    return { error: "Invalid fields provided." };
  }

  try {
    const category = await prisma.category.findFirst({
      select: { id: true },
      where: { name: values.category },
    });
    if (!category) return { error: "Category not found" };

    const agencyId = values.asAgency
      ? (
          await prisma.agencyMember.findFirst({
            select: { agencyId: true },
            where: { user: { id: user.id } },
          })
        )?.agencyId
      : undefined;

    const fileUrl = await uploadFile(values.image, agencyId || user.id);

    const post = await PostManager.create(
      {
        categoryId: category.id,
        content: values.content,
        title: values.title,
        image: fileUrl,
      },
      agencyId ? { agencyId } : { userId: user.id },
      values.tags
    );

    await handlePostBadge(agencyId, user.id);

    return {
      error: "",
      post: `/community/${values.category}/${post.id}`,
    };
  } catch (err) {
    console.error("Post creation failed:", err);
    return { error: "An error occurred while creating post..." };
  }
}

async function uploadFile(
  fileInput: File | FileList | null,
  ownerId: string
): Promise<string | null> {
  if (!fileInput) return null;

  const file =
    fileInput instanceof File
      ? fileInput
      : fileInput instanceof FileList
      ? fileInput[0]
      : null;
  if (!file) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileBlob = new Blob([buffer], { type: file.type });

  try {
    const response = await backendClient.publicFiles.upload({
      content: {
        blob: fileBlob,
        extension: file.type,
      },
      options: {
        replaceTargetUrl: `post-${ownerId}`,
        temporary: false,
      },
      ctx: {
        userId: ownerId,
        userRole: "visitor",
      },
      input: {
        type: "post",
      },
    });

    return response.url;
  } catch (err) {
    console.error("File upload failed:", err);
    throw new Error("File upload error");
  }
}

async function handlePostBadge(
  agencyId: string | undefined,
  userId: string
): Promise<void> {
  const profile = await prisma.profile.findFirst({
    where: agencyId
      ? { agencyProfile: { agencyId } }
      : { userProfile: { userId } },
    select: { id: true },
  });

  if (!profile) return;

  const count = await PostManager.getCountForProfile(profile.id);
  const target = agencyId ? { agencyId } : { userId };

  if (count >= 3) {
    BadgeManager.awardAchievement(target, "OUT_OF_SHADOWS");
  }

  if (count >= 1) {
    BadgeManager.awardAchievement(target, "FIRST_WORD");
  }
}
