import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { UsersList } from "@/app/users/UsersList";
import { renderWithProviders } from "@/__tests__/utils/test-utils";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("UsersList", () => {
  it("should render loading state", () => {
    renderWithProviders(<UsersList />);
    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  it("should render users when data is loaded", async () => {
    renderWithProviders(<UsersList />);

    await waitFor(() => {
      expect(screen.queryByText("Loading users...")).not.toBeInTheDocument();
    });

    // Should have at least one user
    const users = screen.getAllByRole("link");
    expect(users.length).toBeGreaterThan(0);
  });

  it("should have create user link", async () => {
    renderWithProviders(<UsersList />);

    await waitFor(() => {
      expect(screen.queryByText("Loading users...")).not.toBeInTheDocument();
    });

    const createLink = screen.getByText("+ Create User");
    expect(createLink).toBeInTheDocument();
    expect(createLink.closest("a")).toHaveAttribute("href", "/users/new");
  });
});

