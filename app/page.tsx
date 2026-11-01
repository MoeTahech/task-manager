"use client";

import { useEffect, useState } from "react";

type Task = { id: number; title: string; done: boolean };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    setTasks(await res.json());
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    loadTasks();
  }

  async function toggleTask(task: Task) {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    });
    loadTasks();
  }

  async function removeTask(id: number) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
  }

  async function saveEdit(task: Task) {
    const newTitle = editTitle.trim();
    if (!newTitle) return; // stay in edit mode; an empty title isn't allowed
    if (newTitle === task.title) {
      cancelEditing(); // nothing changed, so no request is needed
      return;
    }

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!res.ok) return; // keep the edit box open so the user's text isn't lost

    cancelEditing();
    loadTasks();
  }

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: 16 }}>
      <h1>Task Manager</h1>

      <form onSubmit={addTask} style={{ display: "flex", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ display: "flex", gap: 8, padding: "8px 0" }}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task)}
            />

            {editingId === task.id ? (
              <>
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(task);
                    if (e.key === "Escape") cancelEditing();
                  }}
                  style={{ flex: 1, padding: 4 }}
                />
                <button onClick={() => saveEdit(task)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    flex: 1,
                    textDecoration: task.done ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </span>
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => removeTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}