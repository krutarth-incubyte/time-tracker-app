import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TaskList from "../../../components/Tasks/TaskList";

describe("TaskList", () => {
  it("should render task-list component", () => {
    render(<TaskList />);
    expect(screen.getByText(/Task List/i)).toBeInTheDocument();
  });

  it("should render task-list component with tasks", () => {
    const tasks = [
      { id: 1, name: "Task 1" },
      { id: 2, name: "Task 2" },
      { id: 3, name: "Task 3" },
    ];
    render(<TaskList tasks={tasks} />);
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 3/i)).toBeInTheDocument();
  });
});
