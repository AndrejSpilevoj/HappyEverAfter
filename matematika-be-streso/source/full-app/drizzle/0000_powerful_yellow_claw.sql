CREATE TABLE `assignments` (
	`task_id` text NOT NULL,
	`student_id` text NOT NULL,
	`seen` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`task_id`, `student_id`),
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `auth_attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`reset` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`message_id` text,
	`student_id` text,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`student_id` text NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `message_thread` ON `messages` (`task_id`,`student_id`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`recipient` text NOT NULL,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`status` text NOT NULL,
	`created` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`hash` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`code_hash` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_code_hash_unique` ON `students` (`code_hash`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created` text NOT NULL
);
