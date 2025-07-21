import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Timeblocks from "@/pages/Timeblocks";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
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
});
