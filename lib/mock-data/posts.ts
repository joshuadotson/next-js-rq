export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  likes: number;
  views: number;
};

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    content: "Next.js 15 introduces exciting new features including improved server components, better caching strategies, and enhanced developer experience. In this post, we'll explore the key improvements and how to migrate your existing applications.",
    author: "Jane Doe",
    authorId: "user-1",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    tags: ["nextjs", "react", "web-development"],
    likes: 42,
    views: 1250,
  },
  {
    id: "2",
    title: "Understanding React Query for Server State",
    content: "React Query (TanStack Query) is a powerful library for managing server state in React applications. It provides caching, background updates, and synchronization out of the box. Learn how to structure your queries and mutations effectively.",
    author: "John Smith",
    authorId: "user-2",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
    tags: ["react-query", "state-management", "data-fetching"],
    likes: 38,
    views: 980,
  },
  {
    id: "3",
    title: "Feature-Based Architecture in Modern Apps",
    content: "Organizing your codebase by features rather than by technical layers can significantly improve maintainability and developer experience. This approach groups related functionality together, making it easier to understand and modify.",
    author: "Sarah Johnson",
    authorId: "user-3",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    tags: ["architecture", "best-practices", "code-organization"],
    likes: 29,
    views: 756,
  },
  {
    id: "4",
    title: "TypeScript Tips for Better Type Safety",
    content: "TypeScript's type system can help catch bugs early and improve code quality. Here are some advanced patterns and tips for leveraging TypeScript's type system to write more robust applications.",
    author: "Mike Chen",
    authorId: "user-4",
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    tags: ["typescript", "type-safety", "programming"],
    likes: 51,
    views: 1420,
  },
  {
    id: "5",
    title: "Building Responsive UIs with Tailwind CSS",
    content: "Tailwind CSS provides utility classes that make building responsive designs straightforward. Learn how to use breakpoints, responsive modifiers, and design tokens to create beautiful, adaptive interfaces.",
    author: "Emily Davis",
    authorId: "user-5",
    createdAt: "2024-01-11T11:00:00Z",
    updatedAt: "2024-01-11T11:00:00Z",
    tags: ["tailwind", "css", "responsive-design", "ui"],
    likes: 33,
    views: 890,
  },
  {
    id: "6",
    title: "Server Actions in Next.js: A Complete Guide",
    content: "Server Actions allow you to run server-side code directly from your React components. This simplifies form handling, mutations, and server-side operations. Discover how to use them effectively in your Next.js applications.",
    author: "Alex Rodriguez",
    authorId: "user-6",
    createdAt: "2024-01-10T13:30:00Z",
    updatedAt: "2024-01-10T13:30:00Z",
    tags: ["nextjs", "server-actions", "forms"],
    likes: 27,
    views: 654,
  },
];

