import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/tasks/service", () => ({
  listTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

import { PUT, DELETE } from "@/app/api/tasks/[id]/route";
import { updateTask, deleteTask } from "@/lib/tasks/service";

// In your route, params is a Promise, so the tests pass one too
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

function putRequest(body: string) {
  return new Request("http://localhost/api/tasks/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PUT /api/tasks/[id]", () => {
  it("updates a task and returns 200", async () => {
    vi.mocked(updateTask).mockResolvedValue({ id: 1, title: "Learn tests", done: true });

    const res = await PUT(putRequest(JSON.stringify({ done: true })), ctx("1"));

    expect(res.status).toBe(200);
    expect(updateTask).toHaveBeenCalledWith(1, { done: true });
  });

  it("returns 404 when the task does not exist", async () => {
    vi.mocked(updateTask).mockResolvedValue(null);

    const res = await PUT(putRequest(JSON.stringify({ done: true })), ctx("999"));

    expect(res.status).toBe(404);
  });

  it("returns 400 for an invalid body and never touches the database", async () => {
    const res = await PUT(putRequest(JSON.stringify({ done: "yes" })), ctx("1"));

    expect(res.status).toBe(400);
    expect(updateTask).not.toHaveBeenCalled();
  });
  it("updates only the title, trimmed", async () => {
    vi.mocked(updateTask).mockResolvedValue({ id: 1, title: "New name", done: false });

    const res = await PUT(putRequest(JSON.stringify({ title: "  New name  " })), ctx("1"));

    expect(res.status).toBe(200);
    expect(updateTask).toHaveBeenCalledWith(1, { title: "New name" });
  });

  it("returns 400 for a whitespace-only title and never touches the database", async () => {
    const res = await PUT(putRequest(JSON.stringify({ title: "   " })), ctx("1"));

    expect(res.status).toBe(400);
    expect(updateTask).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/tasks/[id]", () => {
  it("deletes a task and returns 204", async () => {
    vi.mocked(deleteTask).mockResolvedValue(true);

    const res = await DELETE(new Request("http://localhost/api/tasks/1", { method: "DELETE" }), ctx("1"));

    expect(res.status).toBe(204);
  });

  it("returns 404 when the task does not exist", async () => {
    vi.mocked(deleteTask).mockResolvedValue(false);

    const res = await DELETE(new Request("http://localhost/api/tasks/999", { method: "DELETE" }), ctx("999"));

    expect(res.status).toBe(404);
  });
});