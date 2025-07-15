import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { routes } from "../routes";

describe("Routes", () => {
  const renderWithRouter = (initialEntries: string[]) => {
    const router = createMemoryRouter(routes, { initialEntries });
    return render(<RouterProvider router={router} />);
  };

  it("renders Dashboard component for / route", () => {
    renderWithRouter(["/"]);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it("renders Tasks component for /tasks route", () => {
    renderWithRouter(["/tasks"]);
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
  });

  it("renders TimeBlocks component for /timeblocks/:id route", () => {
    renderWithRouter(["/timeblocks/123"]);
    expect(screen.getByText(/TimeBlocks/i)).toBeInTheDocument();
  });
});
