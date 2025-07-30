import { relations } from 'drizzle-orm';
import {
  serial,
  pgTable,
  text,
  timestamp,
  pgEnum,
  integer,
} from 'drizzle-orm/pg-core';
import { timeblocks } from './timeblocks.schema';

export const taskStatusEnum = pgEnum('task_status', [
  'pending',
  'in_progress',
  'completed',
]);

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').default('pending').notNull(),
  parentTaskId: integer('parent_task_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type CreateTask = typeof tasks.$inferInsert;
export type SelectTask = typeof tasks.$inferSelect;

//Relations
export const taskRelations = relations(tasks, ({ many }) => ({
  timeblocks: many(timeblocks),
}));
