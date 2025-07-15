import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TaskList from "../../../components/Tasks/TaskList";
import { TaskStatus } from "../../../types/tasks";
import { MemoryRouter } from "react-router-dom";

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

const tasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    createdAt: new Date(),
    status: TaskStatus.PENDING,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    createdAt: new Date(),
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: 3,
    title: "Task 3",
    description: "Description 3",
    createdAt: new Date(),
    status: TaskStatus.COMPLETED,
  },
];

describe("TaskList", () => {
  it("should render task-list component with tasks", () => {
    renderWithRouter(<TaskList tasks={tasks} />);
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 3/i)).toBeInTheDocument();
  });

  it("should render task-list component with no tasks", () => {
    renderWithRouter(<TaskList tasks={[]} />);
    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
  });
});
