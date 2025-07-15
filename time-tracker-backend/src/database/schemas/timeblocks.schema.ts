import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { tasks } from './tasks.schema';
import { relations } from 'drizzle-orm';

export const timeblocks = pgTable('timeblocks', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id')
    .references(() => tasks.id)
    .notNull(),
  start: timestamp('start').notNull(),
  end: timestamp('end'),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type CreateTimeblock = typeof timeblocks.$inferInsert;
export type SelectTimeblock = typeof timeblocks.$inferSelect;

// Relations
export const timeblockRelations = relations(timeblocks, ({ one }) => ({
  task: one(tasks, {
    fields: [timeblocks.taskId],
    references: [tasks.id],
  }),
}));
