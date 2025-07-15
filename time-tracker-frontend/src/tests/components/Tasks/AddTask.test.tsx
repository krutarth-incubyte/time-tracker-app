import { describe, it, expect } from "vitest";

import { render, screen, fireEvent } from "@testing-library/react";
import AddTask from "@/components/Tasks/AddTask";
import userEvent from "@testing-library/user-event";

describe("AddTask", () => {
  const AddButtonText = /Add Task/i;
  const DialogTitleText = /Add A Task/i;
  it("should render add task button", () => {
    render(<AddTask />);
    expect(screen.getByText(AddButtonText)).toBeInTheDocument();
  });

  it("should open dialog when add task button is clicked", async () => {
    render(<AddTask />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    expect(screen.getByText(DialogTitleText)).toBeInTheDocument();
  });

  it("should close dialog when close button is clicked", async () => {
    render(<AddTask />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    expect(screen.getByText(DialogTitleText)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-button"));
    expect(screen.queryByText(DialogTitleText)).not.toBeInTheDocument();
  });

  it("should render form with input fields for task name and description", async () => {
    render(<AddTask />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    expect(screen.getByText(DialogTitleText)).toBeInTheDocument();
    expect(screen.getByTestId("task-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("task-description-input")).toBeInTheDocument();
  });

  it("should render form with submit button", async () => {
    render(<AddTask />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    expect(screen.getByText(DialogTitleText)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Task" })
    ).toBeInTheDocument();
  });

  it("should render form with clear button", async () => {
    render(<AddTask />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    expect(screen.getByText(DialogTitleText)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("should clear the form when clear button is clicked", async () => {
    render(<AddTask />);
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
    render(<AddTask />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    await user.type(screen.getByTestId("task-name-input"), "Test Task");
    await user.type(
      screen.getByTestId("task-description-input"),
      "Test Description"
    );
    await user.click(screen.getByRole("button", { name: "Add Task" }));
    expect(screen.queryByText(DialogTitleText)).not.toBeInTheDocument();
  });

  it("should verify the form is submitted with the correct values", async () => {
    render(<AddTask />);
    const user = userEvent.setup();
    await user.click(screen.getByText(AddButtonText));
    // when no values are entered, the form should not be submitted
    await user.click(screen.getByRole("button", { name: "Add Task" }));
    expect(screen.getByText(DialogTitleText)).toBeInTheDocument();
    expect(screen.getByTestId("task-name-error")).toBeInTheDocument();
  });
});
