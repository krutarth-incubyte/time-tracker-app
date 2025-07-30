export class Task {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  status: TaskStatus;
  parentTaskId?: number;
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}
