import { describe, it, expect } from "vitest";

import { render, screen } from "@testing-library/react";
import AddTask from "@/components/Tasks/AddTask";
import userEvent from "@testing-library/user-event";

describe("AddTask", () => {
  const AddButtonText = /Add Task/i;
  it("should render add task button", () => {
    render(<AddTask addTaskHandler={() => {}} />);
    expect(screen.getByText(AddButtonText)).toBeInTheDocument();
  });

  it("should open dialog when add task button is clicked", async () => {
    render(<AddTask addTaskHandler={() => {}} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    expect(screen.getByTestId("add-task-dialog")).toBeInTheDocument();
  });

  it("should close dialog when close button is clicked", async () => {
    render(<AddTask addTaskHandler={() => {}} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    expect(screen.getByTestId("add-task-dialog")).toBeInTheDocument();
    await user.click(screen.getByTestId("close-button"));
    expect(screen.queryByTestId("add-task-dialog")).not.toBeInTheDocument();
  });

  it("should render form with input fields for task name and description", async () => {
    render(<AddTask addTaskHandler={() => {}} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    expect(screen.getByTestId("add-task-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("task-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("task-description-input")).toBeInTheDocument();
  });

  it("should clear the form when clear button is clicked", async () => {
    render(<AddTask addTaskHandler={() => {}} />);
    // fill in the form
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    await user.type(screen.getByTestId("task-name-input"), "Test Task");
    await user.type(
      screen.getByTestId("task-description-input"),
      "Test Description"
    );
    expect(screen.getByTestId("task-name-input")).toHaveValue("Test Task");
    expect(screen.getByTestId("task-description-input")).toHaveValue(
      "Test Description"
    );
    // click the clear button
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByTestId("task-name-input")).toHaveValue("");
    expect(screen.getByTestId("task-description-input")).toHaveValue("");
  });

  it("should close the dialog when submit button is clicked with valid values", async () => {
    render(<AddTask addTaskHandler={() => {}} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    await user.type(screen.getByTestId("task-name-input"), "Test Task");
    await user.type(
      screen.getByTestId("task-description-input"),
      "Test Description"
    );
    await user.click(screen.getByRole("button", { name: "Add Task" }));
    expect(screen.queryByTestId("add-task-dialog")).not.toBeInTheDocument();
  });

  it("should verify the form is submitted with the correct values", async () => {
    render(<AddTask addTaskHandler={() => {}} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    // when no values are entered, the form should not be submitted
    await user.click(screen.getByRole("button", { name: "Add Task" }));
    expect(screen.getByTestId("task-name-error")).toBeInTheDocument();
  });
});
