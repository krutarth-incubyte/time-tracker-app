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
});
