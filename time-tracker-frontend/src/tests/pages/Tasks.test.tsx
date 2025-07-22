import { describe, it, expect, vi, beforeEach } from "vitest";
import Tasks from "../../pages/Tasks";
import Timeblocks from "../../pages/Timeblocks";
import { renderWithProviders, screen, userEvent } from "../test-utils";
import { mockTasks } from "@/components/Tasks/mockTasks";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const renderTasksWithRouter = (initialEntries = ["/tasks"]) => {
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
  return renderWithProviders(<RouterProvider router={router} />);
};

describe("Tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render tasks page", async () => {
    renderTasksWithRouter();
    expect(await screen.findByText(/Tasks/i)).toBeInTheDocument();
  });

  it("should render add task button", async () => {
    renderTasksWithRouter();
    expect(await screen.findByText(/Add Task/i)).toBeInTheDocument();
  });

  it("should add task when submit button is clicked on add task dialog", async () => {
    renderTasksWithRouter();
    const user = userEvent.setup();

    // Wait for the page to load
    await screen.findByText(/Add Task/i);

    await user.click(screen.getByText(/Add Task/i));
    await user.type(screen.getByTestId("task-name-input"), "Test Task");
    await user.type(
      screen.getByTestId("task-description-input"),
      "Test Description"
    );
    await user.click(screen.getByRole("button", { name: "Add Task" }));
    expect(screen.queryByTestId("add-task-dialog")).not.toBeInTheDocument();
  });

  it("should navigate to timeblock list when task is clicked", async () => {
    renderTasksWithRouter();

    const user = userEvent.setup();
    // Wait for tasks to load
    await screen.findByText(mockTasks[0].title);
    await user.click(screen.getByText(mockTasks[0].title));
    expect(screen.getByTestId("timeblocks-title")).toBeInTheDocument();
  });
});
