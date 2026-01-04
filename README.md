This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## About

Next RQ is a demonstration application showcasing how to integrate [TanStack Query](https://tanstack.com/query) (React Query) with Next.js App Router. The app demonstrates best practices for managing server state in a Next.js application, including:

- **Server-side prefetching**: Data is prefetched on the server and hydrated on the client with no duplication
- **Colocated state management**: Server state hooks are organized alongside their routes with a hybrid pattern - shared hooks in `_hooks/` subdirectories, single-use hooks colocated with their pages
- **Optimistic updates**: Mutations use optimistic updates for instant UI feedback
- **API routes**: Next.js API routes provide a mock backend for posts data

### Features

- **Posts Management**: Full CRUD operations - browse, view, create, edit, and delete posts with filtering and pagination support
- **Server State Hooks**: Custom React Query hooks colocated with routes for better organization
- **React Query Devtools**: Built-in devtools for debugging queries and mutations
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Documentation

For detailed information about how this integration works, see:

- **[Architecture Overview](./docs/ARCHITECTURE.md)** - Core integration patterns and query client setup
- **[Server-Side Prefetching](./docs/PREFETCHING.md)** - How prefetching and hydration work without duplicate requests
- **[State Management Patterns](./docs/STATE_MANAGEMENT.md)** - Colocated hooks and organization strategy
- **[Optimistic Updates](./docs/OPTIMISTIC_UPDATES.md)** - Implementing instant UI feedback with mutations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
