ALTER TABLE students ADD student_group text NOT NULL DEFAULT 'regular' CHECK(student_group IN ('regular','remote'));
--> statement-breakpoint
ALTER TABLE students ADD service_plan text CHECK(service_plan IS NULL OR service_plan IN ('homework','topics'));
--> statement-breakpoint
CREATE INDEX students_group ON students(student_group,active);
