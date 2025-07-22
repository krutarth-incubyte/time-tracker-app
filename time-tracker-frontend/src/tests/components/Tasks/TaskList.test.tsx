import { renderWithRouter, screen } from "../../test-utils";
import { describe, it, expect } from "vitest";
import TaskList from "../../../components/Tasks/TaskList";
import { mockTasks } from "../../../components/Tasks/mockTasks";

describe("TaskList", () => {
  it("should render task-list component with tasks", () => {
    renderWithRouter(<TaskList tasks={mockTasks} />);
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
  });

  it("should render task-list component with no tasks", () => {
    renderWithRouter(<TaskList tasks={[]} />);
    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
  });
});
