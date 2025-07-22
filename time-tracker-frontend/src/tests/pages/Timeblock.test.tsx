import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent, waitFor } from "../test-utils";
import Timeblocks from "@/pages/Timeblocks";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { mockTimeblocks } from "@/components/Tasks/mockTasks";
import { filterTimeblocks } from "@/lib/utils";
import { resetTimeblocks } from "../setupTests";

const renderTimeblocksWithRouter = (
  ui: React.ReactNode,
  initialRoute = "/timeblocks/1"
) => {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/timeblocks/:taskId" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Timeblock", () => {
  beforeEach(() => {
    resetTimeblocks();
    vi.clearAllMocks();
  });

  it("should render timeblock page", async () => {
    renderTimeblocksWithRouter(<Timeblocks />);
    expect(await screen.findByTestId("timeblocks-title")).toBeInTheDocument();
  });

  it("should render timeblock list", async () => {
    renderTimeblocksWithRouter(<Timeblocks />);
    expect(await screen.findByTestId("timeblock-list")).toBeInTheDocument();
  });

  it("should render add timeblock dialog when add timeblock button is clicked", async () => {
    renderTimeblocksWithRouter(<Timeblocks />);
    const user = userEvent.setup();
    await screen.findByTestId("add-timeblock-button");
    await user.click(screen.getByTestId("add-timeblock-button"));
    expect(screen.getByTestId("add-timeblock-dialog")).toBeInTheDocument();
  });

  it("should submit form with correct data and close dialog", async () => {
    renderTimeblocksWithRouter(<Timeblocks />);
    const user = userEvent.setup();
    await screen.findByTestId("add-timeblock-button");
    await user.click(screen.getByTestId("add-timeblock-button"));
    await user.type(
      screen.getByTestId("timeblock-dialog-description-input"),
      "Test Description"
    );
    await user.selectOptions(
      screen.getByTestId("timeblock-dialog-start-time-input"),
      "00:00"
    );
    await user.selectOptions(
      screen.getByTestId("timeblock-dialog-end-time-input"),
      "01:00"
    );
    await user.click(screen.getByTestId("add-timeblock-dialog-submit-button"));
    expect(
      screen.queryByTestId("timeblock-dialog-description-error")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("timeblock-dialog-start-time-error")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("timeblock-dialog-end-time-error")
    ).not.toBeInTheDocument();
  });

  it("should add timeblock to the list", async () => {
    renderTimeblocksWithRouter(<Timeblocks />);
    const user = userEvent.setup();
    await screen.findByTestId("add-timeblock-button");
    await user.click(screen.getByTestId("add-timeblock-button"));
    await user.type(
      screen.getByTestId("timeblock-dialog-description-input"),
      "Test Description 111"
    );
    await user.selectOptions(
      screen.getByTestId("timeblock-dialog-start-time-input"),
      "00:00"
    );
    await user.selectOptions(
      screen.getByTestId("timeblock-dialog-end-time-input"),
      "01:00"
    );
    await user.click(screen.getByTestId("add-timeblock-dialog-submit-button"));

    // Wait for the mutation to complete and UI to update
    await waitFor(() => {
      expect(screen.getByText("Test Description 111")).toBeInTheDocument();
    });
  });

  it("should add a delete button for each timeblock", async () => {
    renderTimeblocksWithRouter(<Timeblocks />);
    await screen.findByTestId("timeblock-list");
    const timeblocks = filterTimeblocks(mockTimeblocks, 1);
    expect(screen.getAllByTestId("timeblock-delete-button")).toHaveLength(
      timeblocks.length
    );
  });

  it("should delete a timeblock when delete button is clicked", async () => {
    renderTimeblocksWithRouter(<Timeblocks />);
    const user = userEvent.setup();
    await screen.findByTestId("timeblock-list");
    const timeblocks = filterTimeblocks(mockTimeblocks, 1);

    // Verify the timeblock is initially there
    expect(screen.getByText(timeblocks[0].description)).toBeInTheDocument();

    await user.click(screen.getAllByTestId("timeblock-delete-button")[0]);

    // Wait for the delete mutation to complete and UI to update
    await waitFor(() => {
      expect(
        screen.queryByText(timeblocks[0].description)
      ).not.toBeInTheDocument();
    });
  });
});
