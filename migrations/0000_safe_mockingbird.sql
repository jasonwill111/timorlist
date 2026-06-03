CREATE TABLE `user` (
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT 0,
	`phone` text,
	`name` text NOT NULL,
	`image` text,
	`role` text DEFAULT 'user',
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `user_role_idx` ON `user` (`role`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);