-- Add parent_task_id column only if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tasks' AND column_name = 'parent_task_id') THEN
        ALTER TABLE "tasks" ADD COLUMN "parent_task_id" integer;
    END IF;
END $$;