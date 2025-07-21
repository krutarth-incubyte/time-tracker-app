import AddTimeblock from "@/components/Timeblocks/AddTimeblock";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("AddTimeblock", () => {
  it("should close add timeblock dialog when close button is clicked", async () => {
    renderWithRouter(<AddTimeblock taskId={1} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-timeblock-button"));
    await user.click(screen.getByTestId("add-timeblock-dialog-close-button"));
    expect(
      screen.queryByTestId("add-timeblock-dialog")
    ).not.toBeInTheDocument();
  });

  it("should have form with fields following timeblocks types", async () => {
    renderWithRouter(<AddTimeblock taskId={1} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-timeblock-button"));
    expect(screen.getByTestId("add-timeblock-dialog")).toBeInTheDocument();
    expect(
      screen.getByTestId("timeblock-dialog-description-input")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeblock-dialog-start-time-input")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeblock-dialog-end-time-input")
    ).toBeInTheDocument();
  });

  it("should show error message when start time is before end time", async () => {
    renderWithRouter(<AddTimeblock taskId={1} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-timeblock-button"));
    await user.selectOptions(
      screen.getByTestId("timeblock-dialog-start-time-input"),
      "02:00"
    );
    await user.selectOptions(
      screen.getByTestId("timeblock-dialog-end-time-input"),
      "01:00"
    );
    await user.click(screen.getByTestId("add-timeblock-dialog-submit-button"));
    expect(
      screen.getByTestId("timeblock-dialog-end-time-input")
    ).toBeInTheDocument();
  });

  it("should show error message when all required fields are not entered", async () => {
    renderWithRouter(<AddTimeblock taskId={1} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-timeblock-button"));
    await user.click(screen.getByTestId("add-timeblock-dialog-submit-button"));
    expect(
      screen.getByTestId("timeblock-dialog-description-error")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeblock-dialog-start-time-error")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeblock-dialog-end-time-error")
    ).toBeInTheDocument();
  });

  it("should show error message when description is not entered", async () => {
    renderWithRouter(<AddTimeblock taskId={1} />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-timeblock-button"));
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
      screen.getByTestId("timeblock-dialog-description-error")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("timeblock-dialog-start-time-error")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("timeblock-dialog-end-time-error")
    ).not.toBeInTheDocument();
  });
});
