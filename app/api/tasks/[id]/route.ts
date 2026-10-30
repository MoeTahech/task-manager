import { NextResponse } from "next/server";
import { findTask, deleteTask } from "@/lib/tasks";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const task = findTask(Number(id));
  if (!task) {
    return NextResponse.json({ error: "task not found" }, { status: 404 });
  }

  const body = await request.json();
  if (body.title !== undefined) task.title = body.title;
  if (body.done !== undefined) task.done = body.done;
  return NextResponse.json(task);
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  if (!deleteTask(Number(id))) {
    return NextResponse.json({ error: "task not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}