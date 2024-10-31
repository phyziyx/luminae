"use server";

import z from "zod";
import prisma from "@/lib/db";
import { formSchema } from "./types";

export async function onFormSubmit(values: z.infer<typeof formSchema>) {
  console.log(values);
}
