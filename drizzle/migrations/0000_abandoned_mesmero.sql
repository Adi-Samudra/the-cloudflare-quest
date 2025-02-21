CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`thumbnail` text,
	`dateCreated` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`dateCompleted` text,
	`completionStatus` integer DEFAULT 0 NOT NULL
);
