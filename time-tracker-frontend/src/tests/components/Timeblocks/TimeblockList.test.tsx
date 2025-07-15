import { render, screen } from "@testing-library/react";
import TimeblockList from "@/components/Timeblocks/TimeblockList";
import { tasks as mockTasks } from "@/components/Tasks/mockTasks";

describe("TimeblockList", () => {
  it("should render timeblock list with timeblocks", () => {
    render(<TimeblockList timeblocks={mockTasks[0].timeBlocks} />);
    expect(screen.getByText(/Timeblock 1 description/i)).toBeInTheDocument();
  });
});
