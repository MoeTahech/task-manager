import * as repo from "./repository";

export type Task = { id: number; title: string; done: boolean };

function toTask(row: repo.TaskRow): Task {
  return { id: row.id, title: row.title, done: row.done };
}

export async function listTasks(): Promise<Task[]> {
  return (await repo.findAll()).map(toTask);
}

export async function createTask(title: string): Promise<Task> {
  return toTask(await repo.insert(title));
}

export async function updateTask(
  id: number,
  changes: { title?: string; done?: boolean }
): Promise<Task | null> {
  if (!Number.isInteger(id)) return null;
  const row = await repo.updateById(id, changes);
  return row ? toTask(row) : null;
}

export async function deleteTask(id: number): Promise<boolean> {
  if (!Number.isInteger(id)) return false;
  return repo.deleteById(id);
}