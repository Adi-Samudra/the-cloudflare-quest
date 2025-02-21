// src/validations/taskSchema.ts
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    // Accepts a valid ISO datetime string when provided.
    dateCompleted: z
        .string()
        .datetime({ message: "dateCompleted must be a valid ISO date string" })
        .optional(),
    // Use an integer for completionStatus (e.g., 0 for incomplete, 1 for complete)
    completionStatus: z.number().int().optional(),
});

// Optionally export the inferred TypeScript type:
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
