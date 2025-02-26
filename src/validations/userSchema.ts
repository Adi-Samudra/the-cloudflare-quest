// src/validations/taskSchema.ts
import { username } from "better-auth/plugins";
import { z } from "zod";

export const createUserSchema = z.object({
    userID : z.string().min(5, { message: "UserID is required" }),
    name: z.string().min(5, { message: "Name is required" }),
    email: z.string().email({ message: "Email is required" }),
});

export const deleteUserSchema=z.object({
    name:z.string().min(5,{message:"Name is required"})
});

// Optionally export the inferred TypeScript type:
export type CreateTaskInput = z.infer<typeof createUserSchema>;
export type DeleteTaskInput=z.infer<typeof deleteUserSchema>;
