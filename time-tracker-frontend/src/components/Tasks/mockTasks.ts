import { TaskStatus } from "../../types/tasks";

export const tasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Task 1 description",
    createdAt: new Date(),
    status: TaskStatus.PENDING,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Task 2 description",
    createdAt: new Date(),
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: 3,
    title: "Task 3",
    description: "Task 3 description",
    createdAt: new Date(),
    status: TaskStatus.COMPLETED,
  },
];
