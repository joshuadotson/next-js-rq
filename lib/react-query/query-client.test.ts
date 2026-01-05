import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getQueryClient } from "@/lib/react-query/query-client";
import { QueryClient } from "@tanstack/react-query";

describe("getQueryClient", () => {
  const originalWindow = global.window;

  beforeEach(() => {
    // Clear window.__REACT_QUERY_CLIENT__ before each test
    if (global.window) {
      delete (global.window as any).__REACT_QUERY_CLIENT__;
    }
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("should create a new query client on server", () => {
    // Mock server environment
    Object.defineProperty(global, "window", {
      value: undefined,
      writable: true,
    });

    const client1 = getQueryClient();
    const client2 = getQueryClient();

    expect(client1).toBeInstanceOf(QueryClient);
    expect(client2).toBeInstanceOf(QueryClient);
    // Should be different instances on server
    expect(client1).not.toBe(client2);
  });

  it("should return singleton query client on client", () => {
    // Mock client environment
    const mockWindow = {
      __REACT_QUERY_CLIENT__: undefined,
    };
    Object.defineProperty(global, "window", {
      value: mockWindow,
      writable: true,
    });

    const client1 = getQueryClient();
    const client2 = getQueryClient();

    expect(client1).toBeInstanceOf(QueryClient);
    expect(client2).toBeInstanceOf(QueryClient);
    // Should be the same instance on client (singleton)
    expect(client1).toBe(client2);
    expect(mockWindow.__REACT_QUERY_CLIENT__).toBe(client1);
  });

  it("should reuse existing client on client if already created", () => {
    // Mock client environment
    const existingClient = new QueryClient();
    const mockWindow = {
      __REACT_QUERY_CLIENT__: existingClient,
    };
    Object.defineProperty(global, "window", {
      value: mockWindow,
      writable: true,
    });

    const client = getQueryClient();

    expect(client).toBe(existingClient);
  });
});

