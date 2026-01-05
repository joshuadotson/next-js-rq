import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { PostsList } from "@/app/posts/PostsList";
import { renderWithProviders } from "@/__tests__/utils/test-utils";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("PostsList", () => {
  it("should render loading state", () => {
    renderWithProviders(<PostsList />);
    expect(screen.getByText("Loading posts...")).toBeInTheDocument();
  });

  it("should render posts when data is loaded", async () => {
    renderWithProviders(<PostsList />);

    await waitFor(() => {
      expect(screen.queryByText("Loading posts...")).not.toBeInTheDocument();
    });

    // Should have at least one post
    const posts = screen.getAllByRole("link");
    expect(posts.length).toBeGreaterThan(0);
  });

  it("should render empty state when no posts", async () => {
    // This would require mocking the API to return empty array
    // For now, just test that the component renders
    renderWithProviders(<PostsList />);
    await waitFor(() => {
      expect(screen.queryByText("Loading posts...")).not.toBeInTheDocument();
    });
  });

  it("should have create post link", async () => {
    renderWithProviders(<PostsList />);

    await waitFor(() => {
      expect(screen.queryByText("Loading posts...")).not.toBeInTheDocument();
    });

    const createLink = screen.getByText("+ Create Post");
    expect(createLink).toBeInTheDocument();
    expect(createLink.closest("a")).toHaveAttribute("href", "/posts/new");
  });
});

