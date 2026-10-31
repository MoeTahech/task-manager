import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/tasks/service";
import { updateTaskSchema } from "@/lib/tasks/schemas";
import { parseBody } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;

  const parsed = await parseBody(request, updateTaskSchema);
  if (!parsed.ok) return parsed.response;

  const task = await updateTask(Number(id), parsed.data);
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