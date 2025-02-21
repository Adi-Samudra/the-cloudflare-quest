// src/index.ts
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { tasks } from "./db/schema";
import { createTaskSchema } from "./validations/taskSchema";
import { zValidator } from "@hono/zod-validator"; // Import zValidator middleware
import type { Env } from "./worker";

const app = new Hono<{ Bindings: Env }>();

// POST /tasks endpoint with zValidator middleware applied
app.post("/tasks", zValidator("json", createTaskSchema), async (c) => {
  // The validated data is attached to the request and can be retrieved via c.req.valid("json")
  const validatedData = c.req.valid("json");
  
  // Initialize your Cloudflare D1 database connection using drizzle
  const db = drizzle(c.env.DB);

  // Insert the validated task data into your tasks table
  const result = await db.insert(tasks).values(validatedData);

  return c.json({ success: true, result });
});

// GET /tasks endpoint to retrieve tasks (for completeness)
app.get("/tasks", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(tasks).all();
  return c.json(result);
});

export default app;
