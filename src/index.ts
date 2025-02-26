// src/index.ts
import { Hono,Context,Next } from "hono";
import { drizzle } from "drizzle-orm/d1";
// import { tasks } from "./db/schema";
import { users } from "./db/schema";
import { createTaskSchema } from "./validations/taskSchema";
import { zValidator } from "@hono/zod-validator"; // Import zValidator middleware
import type { Env } from "./worker";
import { createClient,SupabaseClient } from '@supabase/supabase-js';
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createUserSchema, deleteUserSchema } from "./validations/userSchema";
import { eq, sql } from "drizzle-orm";
import { json } from "drizzle-orm/mysql-core";

const supabase = createClient(
  "https://sdhmonuhlrbdhtzeplbu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkaG1vbnVobHJiZGh0emVwbGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDg2ODksImV4cCI6MjA1NTIyNDY4OX0.IcSgT2bjr2d_i06ZurI4ni9ymGPEP7HgLRXg6U8USqo");
  interface User {
    id: string;
    email: string;

  }
  
  // Extend the context with custom keys
  interface MyKeys {
    user: User;
  }

  const app = new Hono<{ Bindings: Env; Keys: MyKeys }>();

// POST /tasks endpoint with zValidator middleware applied
// app.post("/tasks", zValidator("json", createTaskSchema), async (c) => {
//   // The validated data is attached to the request and can be retrieved via c.req.valid("json")
//   const validatedData = c.req.valid("json");
  
//   // Initialize your Cloudflare D1 database connection using drizzle
//   const db = drizzle(c.env.DB);

//   // Insert the validated task data into your tasks table
//   const result = await db.insert(tasks).values(validatedData);

//   return c.json({ success: true, result });
// });

app.post("/addUser",zValidator("json",createUserSchema) ,  async (c) => {
  // The validated data is attached to the request and can be retrieved via c.req.valid("json")
  
  // Initialize your Cloudflare D1 database connection using drizzle
  const db = drizzle(c.env.DB);
  const body = await c.req.valid("json");

  const result = await db.insert(users).values({userID:body.userID,name:body.name,email:body.email});

  return c.json({ success: true, result });
});

// GET /tasks endpoint to retrieve tasks (for completeness)
app.get("/getAllUser", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();
  return c.json(result);
});

app.post("/deleteUser",zValidator("json",deleteUserSchema),async (c)=>{
  const db=drizzle(c.env.DB);
  const body = await c.req.valid("json");
  const result=await db.delete(users).where(eq(users.name , body.name));

  if(result.success){
    return c.json({success:true,"message":"User deleted successfully"});
  }
})


const authMiddleware = async (
  c: Context<{ Bindings: Env; Keys: MyKeys }>,
  next: Next
) => {
  const auth = betterAuth({
    database: drizzleAdapter(c.env.DB, {
        provider: "sqlite", // or "mysql", "sqlite"
    })
  });
  
  
  // const authHeader = c.req.header('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return c.json({ error: 'Unauthorized' }, 401);
  // }

  // const token = authHeader.split(' ')[1];

  // // Verify token with Supabase
  // const { data, error } = await supabase.auth.getUser(token);
  // if (error || !data.user) {
  //   return c.json({ error: 'Invalid or expired token' }, 401);
  // }

  // // Attach user data to context (cast to User if needed)
  // await next();
};


// Protected Route Example
app.get('/protected', authMiddleware, (c) => {

  return c.json({ message: 'Welcome to protected route!'})
})

app.post("/signin", async (c) => {
  // Parse the JSON body for credentials
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  // Log in the user with Supabase using email & password
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return c.json({ error: error.message }, 401);
  }

  // Return the session (includes the access token) and user info
  return c.json({
    message: "Login successful",
    session: data.session,
    user: data.user,
  });
});

export default app;
