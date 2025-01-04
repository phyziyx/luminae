import { z } from "zod";

const userFormSchema = z.object({
  id: z.string().min(1).optional(),
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters." }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters." }),
  avatarUrl: z.string().url().optional(),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
});

export default userFormSchema;
