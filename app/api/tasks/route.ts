import { NextResponse } from "next/server";
import { listTasks, createTask } from "@/lib/tasks";
import { createTaskSchema, readJson, formatIssues } from "@/lib/validation";

export async function GET() {
  return NextResponse.json(await listTasks());
}

export async function POST(request: Request) {
  const body = await readJson(request);
  if (body === null) {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const result = createTaskSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "validation failed", issues: formatIssues(result.error) },
      { status: 400 }
    );
  }

  return NextResponse.json(await createTask(result.data.title), { status: 201 });
}