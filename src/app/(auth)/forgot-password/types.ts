import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email({
    message: "Please enter your email.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  code: z.string().min(2, {
    message: "Please input the code.",
  }),
});
