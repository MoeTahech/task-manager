import { NextResponse } from "next/server";

type Task = { id: number; title: string; done: boolean };

const tasks: Task[] = [];
let nextId = 1;

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const task: Task = { id: nextId++, title: body.title, done: false };
  tasks.push(task);
  return NextResponse.json(task, { status: 201 });
}