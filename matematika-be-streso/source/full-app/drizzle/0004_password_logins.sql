ALTER TABLE students ADD username text;
--> statement-breakpoint
ALTER TABLE students ADD password_hash text;
--> statement-breakpoint
CREATE UNIQUE INDEX students_username ON students(username);
