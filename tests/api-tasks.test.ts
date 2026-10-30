import { describe, it, expect, vi, beforeEach } from "vitest";

// Replace the real database layer with fakes. vi.mock is hoisted to the top of the file.
vi.mock("@/lib/tasks", () => ({
  listTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

import { GET, POST } from "@/app/api/tasks/route";
import { listTasks, createTask } from "@/lib/tasks";

function postRequest(body: string) {
  return new Request("http://localhost/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/tasks", () => {
  it("returns the list of tasks with status 200", async () => {
    vi.mocked(listTasks).mockResolvedValue([
      { id: 1, title: "Learn tests", done: false },
    ]);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      { id: 1, title: "Learn tests", done: false },
    ]);
  });
});

describe("POST /api/tasks", () => {
  it("creates a task and returns 201", async () => {
    vi.mocked(createTask).mockResolvedValue({ id: 1, title: "Learn tests", done: false });

    const res = await POST(postRequest(JSON.stringify({ title: "Learn tests" })));

    expect(res.status).toBe(201);
    expect(createTask).toHaveBeenCalledWith("Learn tests");
  });

  it("passes the trimmed title to the database layer", async () => {
    vi.mocked(createTask).mockResolvedValue({ id: 1, title: "Hi", done: false });

    await POST(postRequest(JSON.stringify({ title: "  Hi  " })));

    expect(createTask).toHaveBeenCalledWith("Hi");
  });

  it("returns 400 for an empty title and never touches the database", async () => {
    const res = await POST(postRequest(JSON.stringify({ title: "" })));

    expect(res.status).toBe(400);
    expect(createTask).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await POST(postRequest("{oops"));

    expect(res.status).toBe(400);
    expect(createTask).not.toHaveBeenCalled();
  });
});