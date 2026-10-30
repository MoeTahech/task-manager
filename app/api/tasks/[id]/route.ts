import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/tasks";
import { updateTaskSchema, readJson, formatIssues } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;

  const body = await readJson(request);
  if (body === null) {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const result = updateTaskSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "validation failed", issues: formatIssues(result.error) },
      { status: 400 }
    );
  }

  const task = await updateTask(Number(id), result.data);
  if (!task) {
    return NextResponse.json({ error: "task not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  if (!(await deleteTask(Number(id)))) {
    return NextResponse.json({ error: "task not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}