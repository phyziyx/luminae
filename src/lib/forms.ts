import { z } from "zod";

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
