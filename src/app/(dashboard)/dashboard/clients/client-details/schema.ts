import { z } from "zod";

const clientFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  status: z.enum(["LEAD", "ONBOARDING", "ACTIVE", "INACTIVE", "LOST"]),
});

export default clientFormSchema;
