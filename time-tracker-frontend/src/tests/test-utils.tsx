import React, { ReactElement } from "react";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

// Create a client for testing
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry queries in tests
        gcTime: 0, // Disable cache to prevent test interference
      },
      mutations: {
        retry: false,
      },
    },
  });

// Basic provider wrapper without router (for components that manage their own routing)
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

// Provider wrapper with default router for simple components
export const renderWithRouter = (
  ui: ReactElement,
  initialEntries: string[] = ["/"],
  options?: Omit<RenderOptions, "wrapper">
) => {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

// Export commonly used testing utilities
export { screen, waitFor } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
