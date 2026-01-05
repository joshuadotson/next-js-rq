import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { ProductsList } from "@/app/products/ProductsList";
import { renderWithProviders } from "@/__tests__/utils/test-utils";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ProductsList", () => {
  it("should render loading state", () => {
    renderWithProviders(<ProductsList />);
    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  it("should render products when data is loaded", async () => {
    renderWithProviders(<ProductsList />);

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });

    // Should have at least one product
    const products = screen.getAllByRole("link");
    expect(products.length).toBeGreaterThan(0);
  });

  it("should have create product link", async () => {
    renderWithProviders(<ProductsList />);

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });

    const createLink = screen.getByText("+ Create Product");
    expect(createLink).toBeInTheDocument();
    expect(createLink.closest("a")).toHaveAttribute("href", "/products/new");
  });
});

