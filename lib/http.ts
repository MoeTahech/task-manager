import { NextResponse } from "next/server";
import { z } from "zod";

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

export async function parseBody<S extends z.ZodType>(
  request: Request,
  schema: S
): Promise<ParseResult<z.infer<S>>> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "invalid JSON body" }, { status: 400 }),
    };
  }

  const result = schema.safeParse(json);
  if (!result.success) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "validation failed",
          issues: result.error.issues.map((issue) => ({
            field: issue.path.join(".") || "body",
            message: issue.message,
          })),
        },
        { status: 400 }
      ),
    };
  }

  return { ok: true, data: result.data };
}