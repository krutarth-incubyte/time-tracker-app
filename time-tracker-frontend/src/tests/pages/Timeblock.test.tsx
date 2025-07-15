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

  it("should render add timeblock button", () => {
    renderWithRouter(<Timeblocks />);
    expect(screen.getByTestId("add-timeblock-button")).toBeInTheDocument();
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
});
