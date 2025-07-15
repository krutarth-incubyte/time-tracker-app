import { TaskStatus } from "../../types/tasks";

export const tasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Task 1 description",
    createdAt: new Date(),
    status: TaskStatus.PENDING,
    timeBlocks: [
      {
        id: 1,
        taskId: 1,
        start: new Date(),
        end: new Date(),
        description: "Timeblock 1 description",
        createdAt: new Date(),
      },
    ],
  },
  {
    id: 2,
    title: "Task 2",
    description: "Task 2 description",
    createdAt: new Date(),
    status: TaskStatus.IN_PROGRESS,
    timeBlocks: [
      {
        id: 1,
        taskId: 2,
        start: new Date(),
        end: new Date(),
        description: "Timeblock 2 description",
        createdAt: new Date(),
      },
    ],
  },
  {
    id: 3,
    title: "Task 3",
    description: "Task 3 description",
    createdAt: new Date(),
    status: TaskStatus.COMPLETED,
    timeBlocks: [
      {
        id: 1,
        taskId: 3,
        start: new Date(),
        end: new Date(),
        description: "Timeblock 3 description",
        createdAt: new Date(),
      },
      {
        id: 2,
        taskId: 3,
        start: new Date(),
        end: new Date(),
        description: "Timeblock 3 description 2",
        createdAt: new Date(),
      },
    ],
  },
];
