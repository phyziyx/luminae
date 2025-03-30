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

// Comment Like Schema

export const commentLikeSchema = z.object({
  commentId: z.string().min(1, {
    message: "Comment ID is required",
  }),
  ...likeSchema.shape,
});

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
});

export type CommentFormSchema = z.infer<typeof commentFormSchema>;

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
