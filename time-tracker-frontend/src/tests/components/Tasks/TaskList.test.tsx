import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("TaskList", () => {
  it("should render task-list component", () => {
    render(<TaskList />);
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
  });
});
