import type { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-white/10 backdrop-blur-lg border-r border-white/10 p-6 space-y-6">
        <h2 className="text-2xl font-bold tracking-wide">Admin</h2>
        <nav className="flex flex-col space-y-3">
          <Link href="/dashboard" className="hover:text-white/80 transition">
            Dashboard
          </Link>
          <Link
            href="/dashboard/posts"
            className="hover:text-white/80 transition"
          >
            Posts
          </Link>
          <Link
            href="/dashboard/categories"
            className="hover:text-white/80 transition"
          >
            Categories
          </Link>
          <Link
            href="/dashboard/users"
            className="hover:text-white/80 transition"
          >
            Users
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
