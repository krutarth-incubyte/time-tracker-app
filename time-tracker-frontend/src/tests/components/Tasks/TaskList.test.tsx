import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TaskList from "../../../components/Tasks/TaskList";
import { TaskStatus } from "../../../types/tasks";

const tasks = [
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

describe("TaskList", () => {
  it("should render task-list component with tasks", () => {
    render(<TaskList tasks={tasks} />);
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 3/i)).toBeInTheDocument();
  });
});
