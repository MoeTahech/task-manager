import { describe, it, expect } from "vitest";
import { createTaskSchema, updateTaskSchema } from "@/lib/validation";

describe("createTaskSchema", () => {
  it("accepts a valid title", () => {
    const result = createTaskSchema.safeParse({ title: "Buy milk" });
    expect(result.success).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    const result = createTaskSchema.parse({ title: "  Buy milk  " });
    expect(result.title).toBe("Buy milk");
  });

  it("rejects a missing title", () => {
    expect(createTaskSchema.safeParse({}).success).toBe(false);
  });

  it("rejects an empty or whitespace-only title", () => {
    expect(createTaskSchema.safeParse({ title: "" }).success).toBe(false);
    expect(createTaskSchema.safeParse({ title: "   " }).success).toBe(false);
  });

  it("rejects a title that is not a string", () => {
    expect(createTaskSchema.safeParse({ title: 123 }).success).toBe(false);
  });

  it("rejects a title longer than 200 characters", () => {
    const result = createTaskSchema.safeParse({ title: "a".repeat(201) });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("accepts a change to done only", () => {
    expect(updateTaskSchema.safeParse({ done: true }).success).toBe(true);
  });

  it("accepts a change to title only", () => {
    expect(updateTaskSchema.safeParse({ title: "New name" }).success).toBe(true);
  });

  it("rejects an empty update", () => {
    expect(updateTaskSchema.safeParse({}).success).toBe(false);
  });

  it("rejects a done value that is not a boolean", () => {
    expect(updateTaskSchema.safeParse({ done: "yes" }).success).toBe(false);
  });
});