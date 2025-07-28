import { mockTasks, mockTimeblocks } from "@/components/Tasks/mockTasks";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch for tests
global.fetch = vi.fn();

vi.mock("@/api/tasks", () => ({
  tasksApi: {
    getTasks: vi.fn(() => Promise.resolve(mockTasks)),
    createTask: vi.fn((taskData) =>
      Promise.resolve({
        id: Date.now(),
        title: taskData.title,
        description: taskData.description,
        createdAt: new Date(),
        status: "pending",
      })
    ),
    updateTask: vi.fn((id, data) => Promise.resolve({ id, ...data })),
    deleteTask: vi.fn(() => Promise.resolve()),
  },
}));

let testTimeblocks = [...mockTimeblocks.filter((tb) => tb.taskId === 1)];
vi.mock("@/api/timeblocks", () => ({
  timeblocksApi: {
    getTimeblocks: vi.fn(() => Promise.resolve(mockTimeblocks)),
    getTimeblocksForTask: vi.fn(() => Promise.resolve([...testTimeblocks])),
    createTimeblock: vi.fn((data) => {
      const newTimeblock = {
        id: Date.now(),
        taskId: 1,
        start: new Date(data.start),
        end: new Date(data.end),
        description: data.description,
        createdAt: new Date(),
      };
      testTimeblocks.push(newTimeblock);
      return Promise.resolve(newTimeblock);
    }),
    updateTimeblock: vi.fn((id, data) => {
      const existingTimeblock = testTimeblocks.find((tb) => tb.id === id);
      if (!existingTimeblock) {
        throw new Error("Timeblock not found");
      }
      return Promise.resolve({ ...existingTimeblock, ...data });
    }),
    deleteTimeblock: vi.fn((id) => {
      testTimeblocks = testTimeblocks.filter((tb) => tb.id !== id);
      return Promise.resolve();
    }),
  },
}));

export const resetTimeblocks = () => {
  testTimeblocks = [...mockTimeblocks.filter((tb) => tb.taskId === 1)];
};

// Setup for any global test configuration
beforeEach(() => {
  vi.clearAllMocks();
});
