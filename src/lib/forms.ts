import { z } from "zod";

// Like Schema

export const LikeType = z.enum(["LIKE", "DISLIKE"]);

export type LikeType = z.infer<typeof LikeType>;

export const likeSchema = z.object({
  type: LikeType,
});

export type LikeSchema = z.infer<typeof likeSchema>;

// Post Like Schema

export const postLikeSchema = z.object({
  postId: z.string().min(1, {
    message: "Post ID is required",
  }),
  ...likeSchema.shape,
});

export type PostLikeSchema = z.infer<typeof postLikeSchema>;

// Comment Like Schema

export const commentLikeSchema = z.object({
  commentId: z.string().min(1, {
    message: "Comment ID is required",
  }),
  ...likeSchema.shape,
});

export type CommentLikeSchema = z.infer<typeof commentLikeSchema>;

// Comment Form Schema

export const commentFormSchema = z.object({
  postId: z.string().min(1, {
    message: "Post ID is required",
  }),
  parentId: z.string().optional(),
  content: z
    .string()
    .min(4, {
      message: "Comment content is required",
    })
    .max(2048, {
      message: "Comment content is too long",
    }),
  asAgency: z.boolean().optional(),
});

export type CommentFormSchema = z.infer<typeof commentFormSchema>;

// Update Comment Schema

export const updateCommentSchema = z.object({
  commentId: z.string(),
  content: z
    .string()
    .min(4, {
      message: "Comment content is required",
    })
    .max(2048, {
      message: "Comment content is too long",
    }),
});

export type UpdateCommentSchema = z.infer<typeof updateCommentSchema>;

//

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    newPasswordConfirm: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords do not match",
    path: ["newPasswordConfirm"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

//

export const invitationRegistrationSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  invitationId: z.string().min(1, {
    message: "Invalid invitation ID",
  }),
});

export type InvitationRegistrationSchema = z.infer<
  typeof invitationRegistrationSchema
>;

// Kanban Board: Lane Name Edit

export const laneNameEditSchema = z.object({
  name: z.string(),
});

export type LaneNameEditSchema = z.infer<typeof laneNameEditSchema>;

// Kanban Board: Create Lane

export const createLaneSchema = z.object({
  id: z.string().optional(),
  workspaceId: z.string(),
  name: z.string().min(2, { message: "Agency name must be atleast 2 chars." }),
  colour: z.string().min(6, { message: "Colour must be a valid hex code." }),
});

export type CreateLaneSchema = z.infer<typeof createLaneSchema>;

// Kanban Board: Update Lane

export const laneTicketFormSchema = z.object({
  id: z.string().optional(),
  laneId: z.string(),
  name: z.string().min(2, { message: "Agency name must be atleast 2 chars." }),
  description: z
    .string()
    .min(2, { message: "Description must be atleast 2 chars." }),
  open: z.boolean().optional(),
  value: z.string(),
  tag: z.string(),
  clientId: z.string(),
  userId: z.string(),
});

export type LaneTicketFormSchema = z.infer<typeof laneTicketFormSchema>;

// Search Bar

export const searchBarSchema = z.object({
  search: z
    .string()
    .min(3, {
      message: "Search query must be at least 3 characters",
    })
    .max(100, {
      message: "Search query is too long",
    }),
});

export type SearchBarSchema = z.infer<typeof searchBarSchema>;

// Tag Schema

export const tagSchema = z
  .string()
  .regex(/^[a-zA-Z0-9\-_]+$/, {
    message: "Tag can only contain letters, numbers, dashes and underscores",
  })
  .toLowerCase()
  .min(2, {
    message: "Tag must be at least 2 characters long.",
  })
  .max(16, {
    message: "Tag can not be more than 16 characters long.",
  })
  .trim();

// Tags Schema

export const tagsSchema = z
  .array(tagSchema)
  .max(5, {
    message: "You can only add up to 5 tags",
  })
  .optional();

export type TagsSchema = z.infer<typeof tagsSchema>;

// Create Post Schema

export const createPostSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title is too long")
    .trim(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(2048, "Content is too long")
    .trim(),
  image: z.instanceof(File).nullable(),
  imagePreview: z.string().optional(),
  tags: tagsSchema.optional(),
  asAgency: z.boolean().optional(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;

// Community Profile Schema

export const communityProfileSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Name must be at least 4 characters long.",
    })
    .max(64, {
      message: "Name can not be more than 64 characters long.",
    })
    .trim(),
  tagline: z
    .string()
    .min(4, {
      message: "Tagline must be at least 4 characters",
    })
    .max(150, {
      message: "Tagline can be at most 150 characters",
    })
    .trim()
    .optional(),
  content: z
    .string()
    .min(10, {
      message: "Content must be at least 10 characters",
    })
    .max(1000, {
      message: "Content can be at most 1000 characters",
    })
    .trim()
    .optional(),
  profileImage: z.any().refine((val) => val.length !== 1, "File is required"),
  bannerImage: z.any().refine((val) => val.length !== 1, "File is required"),
  title: z
    .string()
    .min(4, {
      message: "Title must be at least 4 characters",
    })
    .max(100, {
      message: "Title can be at most 100 characters",
    })
    .trim()
    .optional(),
});

export type CommunityProfileSchema = z.infer<typeof communityProfileSchema>;

export const bookmarkPostFormSchema = z.object({
  postId: z.string().min(1, { message: "Post ID is required." }),
});

export type BookmarkPostFormSchema = z.infer<typeof bookmarkPostFormSchema>;
