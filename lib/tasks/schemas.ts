import { z } from "zod";

const title = z
  .string()
  .trim()
  .min(1, "title cannot be empty")
  .max(200, "title is too long");

export const createTaskSchema = z.object({ title });

export const updateTaskSchema = z
  .object({
    title: title.optional(),
    done: z.boolean().optional(),
  })
  .refine((data) => data.title !== undefined || data.done !== undefined, {
    message: "provide at least one of: title, done",
  });