import { renderWithProviders, screen } from "./test-utils";
import App from "../App";

it("renders learn react link", async () => {
  renderWithProviders(<App />);
  const linkElement = await screen.findByText(/Tasks/i);
  expect(linkElement).toBeInTheDocument();
});
