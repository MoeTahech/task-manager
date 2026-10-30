export type Task = { id: number; title: string; done: boolean };

export const tasks: Task[] = [];
let nextId = 1;

export function createTask(title: string): Task {
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  return task;
}

export function findTask(id: number) {
  return tasks.find((t) => t.id === id);
}

export function deleteTask(id: number): boolean {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}