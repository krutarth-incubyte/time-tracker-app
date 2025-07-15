export interface Task {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  status: (typeof TaskStatus)[keyof typeof TaskStatus];
}

export const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export interface AddTaskSchema {
  taskName: string;
  taskDescription: string;
}
