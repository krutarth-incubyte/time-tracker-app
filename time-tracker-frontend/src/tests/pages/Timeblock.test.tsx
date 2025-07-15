import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Timeblocks from "@/pages/Timeblocks";
import { MemoryRouter } from "react-router-dom";

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
});
