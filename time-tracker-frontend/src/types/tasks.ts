export interface Task {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  status: (typeof TaskStatus)[keyof typeof TaskStatus];
  parentTaskId?: number;
}

export const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export interface AddTaskSchema {
  title: string;
  description: string;
  parentTaskId?: number;
}

export type UpdateTaskSchema = {
  title?: string;
  description?: string;
  status?: (typeof TaskStatus)[keyof typeof TaskStatus];
  parentTaskId?: number;
};
