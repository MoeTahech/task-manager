import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../prisma";

export type TaskRow = { id: number; title: string; done: boolean };

function isNotFound(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025";
}

export async function findAll(): Promise<TaskRow[]> {
  return prisma.task.findMany({ orderBy: { createdAt: "asc" } });
}

export async function insert(title: string): Promise<TaskRow> {
  return prisma.task.create({ data: { title } });
}

export async function updateById(
  id: number,
  changes: { title?: string; done?: boolean }
): Promise<TaskRow | null> {
  try {
    return await prisma.task.update({ where: { id }, data: changes });
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export async function deleteById(id: number): Promise<boolean> {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch (e) {
    if (isNotFound(e)) return false;
    throw e;
  }
}