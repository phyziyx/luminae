import { z } from "zod";

const userFormSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(2, { message: "User name must be at least 2 characters." }),
  avatarUrl: z.string().url().optional(),
  email: z.string().email({ message: "Invalid email format" }).min(1, { message: "Email is required" }),

  stripeConnectAccountId: z.string().optional(),
  stripeCustomerId: z.string().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export default userFormSchema;