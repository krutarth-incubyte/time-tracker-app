import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TaskList from "../../../components/Tasks/TaskList";

describe("TaskList", () => {
  it("should render task-list component", () => {
    render(<TaskList />);
    expect(screen.getByText(/TaskList/i)).toBeInTheDocument();
  });
});
