import { Prisma } from "../generated/prisma/client";
import { prisma } from "./prisma";

export type Task = { id: number; title: string; done: boolean };

function toTask(row: { id: number; title: string; done: boolean }): Task {
  return { id: row.id, title: row.title, done: row.done };
}

function isNotFound(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025";
}

export async function listTasks(): Promise<Task[]> {
  const rows = await prisma.task.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toTask);
}

export async function createTask(title: string): Promise<Task> {
  return toTask(await prisma.task.create({ data: { title } }));
}

export async function updateTask(
  id: number,
  changes: { title?: string; done?: boolean }
): Promise<Task | null> {
  if (!Number.isInteger(id)) return null;
  try {
    return toTask(await prisma.task.update({ where: { id }, data: changes }));
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export async function deleteTask(id: number): Promise<boolean> {
  if (!Number.isInteger(id)) return false;
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch (e) {
    if (isNotFound(e)) return false;
    throw e;
  }
}