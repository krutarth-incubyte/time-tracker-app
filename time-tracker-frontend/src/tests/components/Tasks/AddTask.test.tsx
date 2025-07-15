import { describe, it, expect } from "vitest";

import { render, screen, fireEvent } from "@testing-library/react";
import AddTask from "@/components/Tasks/AddTask";

describe("AddTask", () => {
  const AddButtonText = /Add Task/i;
  const DialogTitleText = /Add A Task/i;
  it("should render add task button", () => {
    render(<AddTask />);
    expect(screen.getByText(AddButtonText)).toBeInTheDocument();
  });

  it("should open dialog when add task button is clicked", () => {
    render(<AddTask />);
    fireEvent.click(screen.getByText(AddButtonText));
    expect(screen.getByText(DialogTitleText)).toBeInTheDocument();
  });

  it("should close dialog when close button is clicked", () => {
    render(<AddTask />);
    fireEvent.click(screen.getByText(AddButtonText));
    expect(screen.getByText(DialogTitleText)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-button"));
    expect(screen.queryByText(DialogTitleText)).not.toBeInTheDocument();
  });

  it("should render form with input fields for task name and description", () => {
    render(<AddTask />);
    fireEvent.click(screen.getByText(AddButtonText));
    expect(screen.getByText(DialogTitleText)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task Description")).toBeInTheDocument();
  });

  it("should render form with submit button", () => {});

  it("should render form with clear button", () => {});

  it("should clear the form when clear button is clicked", () => {});

  it("should close the dialog when submit button is clicked", () => {});
});
