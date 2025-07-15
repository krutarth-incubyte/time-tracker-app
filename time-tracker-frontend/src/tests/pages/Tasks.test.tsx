import { describe, it, expect } from "vitest";
import Tasks from "../../pages/Tasks";
import { render, screen } from "@testing-library/react";

describe("Tasks", () => {
  it("should render tasks page", () => {
    render(<Tasks />);
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
  });

  it("should render add task button", () => {
    render(<Tasks />);
    expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
  });
});
