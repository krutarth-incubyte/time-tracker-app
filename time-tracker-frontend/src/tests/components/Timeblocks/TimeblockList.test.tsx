import { render, screen } from "@testing-library/react";
import TimeblockList from "@/components/Timeblocks/TimeblockList";
import { MemoryRouter } from "react-router-dom";
import { mockTimeblocks } from "@/components/Tasks/mockTasks";

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("TimeblockList", () => {
  it("should render timeblock list with timeblocks", () => {
    renderWithRouter(<TimeblockList timeblocks={mockTimeblocks} />);
    expect(screen.getByText(mockTimeblocks[0].description)).toBeInTheDocument();
  });

  it("should render timeblock list with no timeblocks", () => {
    renderWithRouter(<TimeblockList timeblocks={[]} />);
    expect(screen.getByText(/No timeblocks found/i)).toBeInTheDocument();
  });

  it("should render add timeblock button", () => {
    renderWithRouter(<TimeblockList timeblocks={mockTimeblocks} />);
    expect(screen.getByText(/Add Timeblock/i)).toBeInTheDocument();
  });
});
