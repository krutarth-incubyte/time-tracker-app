import { TaskStatus } from "../../types/tasks";

export const mockTasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Task one description",
    createdAt: new Date(),
    status: TaskStatus.PENDING,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Task two description",
    createdAt: new Date(),
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: 3,
    title: "Task 3",
    description: "Task three description",
    createdAt: new Date(),
    status: TaskStatus.COMPLETED,
  },
];

export const mockTimeblocks = [
  {
    id: 1,
    taskId: 1,
    start: new Date(),
    end: new Date(),
    description: "Timeblock 1 description 1",
    createdAt: new Date(),
  },
  {
    id: 2,
    taskId: 1,
    start: new Date(),
    end: new Date(),
    description: "Timeblock 1 description 2",
    createdAt: new Date(),
  },
  {
    id: 20,
    taskId: 1,
    start: new Date(),
    end: new Date(),
    description: "Timeblock 1 description 3",
    createdAt: new Date(),
  },
  {
    id: 3,
    taskId: 2,
    start: new Date(),
    end: new Date(),
    description: "Timeblock 2 description",
    createdAt: new Date(),
  },
  {
    id: 4,
    taskId: 3,
    start: new Date(),
    end: new Date(),
    description: "Timeblock 3 description",
    createdAt: new Date(),
  },
];
