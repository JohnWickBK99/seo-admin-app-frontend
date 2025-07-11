# SEO Admin App Frontend Template

This is a **Next.js template** designed to help developers quickly bootstrap a **landing page** and **blog** project with essential features, easy extensibility, and customization.

## Key Features
- Clear folder structure for easy inheritance
- Built-in authentication (login, register)
- Dashboard for managing blog posts
- Supabase integration for backend
- SEO-ready and performance optimized
- Easily extendable with new modules

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the main page at `app/page.tsx`. The page will auto-update as you save the file.

## Customization & Extending
- To add a new landing page, create a file in `app/`
- To add or edit blog posts, use files in `app/dashboard/posts/`
- Authentication is located in `app/(auth)/`
- Supabase connection is configured in `lib/supabase.ts`

## Contribution
This is an open template. You can fork and develop it further for your own needs.

---

## Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

## Deploy on Vercel

Easily deploy with [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See more [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).


## Using Prisma ORM

### 1. Install dependencies

```bash
pnpm add @prisma/client
pnpm add -D prisma
```

### 2. Configure database connection

Create a `.env` file in the project root and add your database connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

### 3. Generate Prisma Client

```bash
pnpm prisma generate
```

### 4. Push schema to database (create tables)

```bash
pnpm prisma db push
```

Or, to use migrations:

```bash
pnpm prisma migrate dev --name init
```

### 5. Open Prisma Studio (optional)

```bash
pnpm prisma studio
```

### 6. Use Prisma Client in your code

```ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// ... your queries here ...
```