import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "title cannot be empty").max(200, "title is too long"),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "title cannot be empty").max(200, "title is too long").optional(),
    done: z.boolean().optional(),
  })
  .refine((data) => data.title !== undefined || data.done !== undefined, {
    message: "provide at least one of: title, done",
  });

// Returns the parsed JSON, or null if the body isn't valid JSON
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Turns a Zod error into a simple list for the API response
export function formatIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
}