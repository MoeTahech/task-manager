import { NextResponse } from "next/server";
import { listTasks, createTask } from "@/lib/tasks/service";
import { createTaskSchema } from "@/lib/tasks/schemas";
import { parseBody } from "@/lib/http";

export async function GET() {
  return NextResponse.json(await listTasks());
}

export async function POST(request: Request) {
  const parsed = await parseBody(request, createTaskSchema);
  if (!parsed.ok) return parsed.response;

  return NextResponse.json(await createTask(parsed.data.title), { status: 201 });
}