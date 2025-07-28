import { renderWithProviders, screen } from "./test-utils";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { routes } from "../routes";

describe("Routes", () => {
  const renderRoutesWithRouter = (initialEntries: string[]) => {
    const router = createMemoryRouter(routes, { initialEntries });
    return renderWithProviders(<RouterProvider router={router} />);
  };

  it("renders Dashboard component for / route", async () => {
    renderRoutesWithRouter(["/"]);
    expect(await screen.findByText(/Tasks/i)).toBeInTheDocument();
  });

  it("renders Tasks component for /tasks route", async () => {
    renderRoutesWithRouter(["/tasks"]);
    expect(await screen.findByText(/Tasks/i)).toBeInTheDocument();
  });

  it("renders Timeblocks component for /timeblocks/:taskId route", async () => {
    renderRoutesWithRouter(["/tasks/1"]);
    expect(await screen.findByTestId("timeblocks-title")).toBeInTheDocument();
  });
});
