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
    renderWithRouter(<AddTimeblock />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-timeblock-button"));
    await user.click(screen.getByTestId("add-timeblock-dialog-close-button"));
    expect(
      screen.queryByTestId("add-timeblock-dialog")
    ).not.toBeInTheDocument();
  });

  it("should have form with fields following timeblocks types", async () => {
    renderWithRouter(<AddTimeblock />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-timeblock-button"));
    expect(screen.getByTestId("add-timeblock-dialog")).toBeInTheDocument();
    expect(
      screen.getByTestId("timeblock-dialog-description-input")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeblock-dialog-start-input")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("timeblock-dialog-end-input")
    ).toBeInTheDocument();
  });
});
