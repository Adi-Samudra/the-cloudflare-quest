// src/db/schema.ts
import { sqliteTable, text, integer} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// export const tasks = sqliteTable("tasks", {
//     id: integer().primaryKey({ autoIncrement: true }),
//     title: text().notNull(),
//     description: text(),            // Optional: add .notNull() if required
//     thumbnail: text(),              // Stores an image ID as string
//     dateCreated: text().notNull().default(sql`CURRENT_TIMESTAMP`),
//     dateCompleted: text(),          // Can be null if not yet completed
//     completionStatus: integer().notNull().default(0), //0: not completed, 1: completed
// });

export const users=sqliteTable("users",{
    userID:text().primaryKey().unique(),
    name: text().notNull(),
    email: text().notNull().unique(),
    remainingChats: integer().notNull().default(5),
    accountCreated: text().notNull().default(sql`CURRENT_TIMESTAMP`),
});


