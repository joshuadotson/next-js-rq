import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { PostDetail } from "@/app/posts/[id]/PostDetail";
import { renderWithProviders } from "@/__tests__/utils/test-utils";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("PostDetail", () => {
  it("should render loading state", () => {
    renderWithProviders(<PostDetail id="1" />);
    expect(screen.getByText("Loading post...")).toBeInTheDocument();
  });

  it("should render post details when loaded", async () => {
    renderWithProviders(<PostDetail id="1" />);

    await waitFor(() => {
      expect(screen.queryByText("Loading post...")).not.toBeInTheDocument();
    });

    // Should have post title
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
  });

  it("should have edit and delete buttons", async () => {
    renderWithProviders(<PostDetail id="1" />);

    await waitFor(() => {
      expect(screen.queryByText("Loading post...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});

