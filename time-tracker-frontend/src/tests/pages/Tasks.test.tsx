import { describe, it, expect } from "vitest";
import Tasks from "../../pages/Tasks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { tasks as mockTasks } from "@/components/Tasks/mockTasks";

describe("Tasks", () => {
  it("should render tasks page", () => {
    render(<Tasks />);
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
  });

  it("should render add task button", () => {
    render(<Tasks />);
    expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
  });

  it("should add task when submit button is clicked on add task dialog", async () => {
    render(<Tasks />);
    const user = userEvent.setup();
    await user.click(screen.getByText(/Add Task/i));
    await user.type(screen.getByTestId("task-name-input"), "Test Task");
    await user.type(
      screen.getByTestId("task-description-input"),
      "Test Description"
    );
    await user.click(screen.getByRole("button", { name: "Add Task" }));
    expect(screen.queryByTestId("add-task-dialog")).not.toBeInTheDocument();
    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
  });

  it("should render timeblock list when task is clicked", async () => {
    render(<Tasks />);
    const user = userEvent.setup();
    await user.click(screen.getByText(mockTasks[0].title));
    expect(
      screen.getByText(mockTasks[0].timeBlocks[0].description)
    ).toBeInTheDocument();
  });
});
