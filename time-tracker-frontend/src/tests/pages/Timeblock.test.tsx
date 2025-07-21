import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Timeblocks from "@/pages/Timeblocks";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { mockTimeblocks } from "@/components/Tasks/mockTasks";
import { filterTimeblocks } from "@/lib/utils";

const renderWithRouter = (
  ui: React.ReactNode,
  initialRoute = "/timeblocks/1"
) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/timeblocks/:taskId" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Timeblock", () => {
  it("should render timeblock page", () => {
    renderWithRouter(<Timeblocks />);
    expect(screen.getByTestId("timeblocks-title")).toBeInTheDocument();
  });

  it("should render timeblock list", () => {
    renderWithRouter(<Timeblocks />);
    expect(screen.getByTestId("timeblock-list")).toBeInTheDocument();
  });

  it("should render add timeblock dialog when add timeblock button is clicked", async () => {
    renderWithRouter(<Timeblocks />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-timeblock-button"));
    expect(screen.getByTestId("add-timeblock-dialog")).toBeInTheDocument();
  });

  it("should submit form with correct data and close dialog", async () => {
    renderWithRouter(<Timeblocks />);
    const user = userEvent.setup();
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
    renderWithRouter(<Timeblocks />);
    const user = userEvent.setup();
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
    expect(screen.getByText("Test Description 111")).toBeInTheDocument();
  });

  it("should add a delete button for each timeblock", () => {
    renderWithRouter(<Timeblocks />);
    const timeblocks = filterTimeblocks(mockTimeblocks, 1);
    expect(screen.getAllByTestId("timeblock-delete-button")).toHaveLength(
      timeblocks.length
    );
  });

  it("should delete a timeblock when delete button is clicked", async () => {
    renderWithRouter(<Timeblocks />);
    const user = userEvent.setup();
    const timeblocks = filterTimeblocks(mockTimeblocks, 1);
    await user.click(screen.getAllByTestId("timeblock-delete-button")[0]);
    expect(
      screen.queryByText(timeblocks[0].description)
    ).not.toBeInTheDocument();
  });
});
