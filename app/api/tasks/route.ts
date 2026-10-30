import { NextResponse } from "next/server";
import { tasks, createTask } from "@/lib/tasks";

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  return NextResponse.json(createTask(body.title), { status: 201 });
}