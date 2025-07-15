import { describe, it, expect } from "vitest";
import Tasks from "../../pages/Tasks";
import Timeblocks from "../../pages/Timeblocks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockTasks } from "@/components/Tasks/mockTasks";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const renderWithRouter = (initialEntries = ["/tasks"]) => {
  const router = createMemoryRouter(
    [
      {
        path: "/tasks",
        element: <Tasks />,
      },
      {
        path: "/timeblocks/:taskId",
        element: <Timeblocks />,
      },
    ],
    {
      initialEntries,
    }
  );
  return render(<RouterProvider router={router} />);
};

describe("Tasks", () => {
  it("should render tasks page", () => {
    renderWithRouter();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
  });

  it("should render add task button", () => {
    renderWithRouter();
    expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
  });

  it("should add task when submit button is clicked on add task dialog", async () => {
    renderWithRouter();
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

  it("should navigate to timeblock list when task is clicked", async () => {
    renderWithRouter();

    const user = userEvent.setup();
    await user.click(screen.getByText(mockTasks[0].title));
    expect(screen.getByTestId("timeblocks-title")).toBeInTheDocument();
  });
});
