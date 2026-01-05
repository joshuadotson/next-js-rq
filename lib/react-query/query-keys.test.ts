import { describe, it, expect } from "vitest";
import { createQueryKey } from "@/lib/react-query/query-keys";

describe("createQueryKey", () => {
  it("should create a simple query key without params", () => {
    const key = createQueryKey("posts");
    expect(key).toEqual(["posts"]);
  });

  it("should create a query key with params", () => {
    const key = createQueryKey("posts", { limit: 10, offset: 0 });
    expect(key).toEqual(["posts", { limit: 10, offset: 0 }]);
  });

  it("should filter out undefined values from params", () => {
    const key = createQueryKey("posts", {
      limit: 10,
      offset: 0,
      authorId: undefined,
    });
    expect(key).toEqual(["posts", { limit: 10, offset: 0 }]);
  });

  it("should return simple key when all params are undefined", () => {
    const key = createQueryKey("posts", {
      limit: undefined,
      offset: undefined,
    });
    expect(key).toEqual(["posts"]);
  });

  it("should handle empty params object", () => {
    const key = createQueryKey("posts", {});
    expect(key).toEqual(["posts"]);
  });

  it("should preserve zero and false values", () => {
    const key = createQueryKey("posts", { limit: 0, offset: 0 });
    expect(key).toEqual(["posts", { limit: 0, offset: 0 }]);
  });

  it("should preserve empty string values", () => {
    const key = createQueryKey("posts", { tag: "" });
    expect(key).toEqual(["posts", { tag: "" }]);
  });
});

