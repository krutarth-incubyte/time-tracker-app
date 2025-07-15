import { render, screen } from "@testing-library/react";
import TimeblockList from "@/components/Timeblocks/TimeblockList";

describe("TimeblockList", () => {
  it("should render timeblock list", () => {
    render(<TimeblockList />);
    expect(screen.getByText("Timeblock List")).toBeInTheDocument();
  });
});
