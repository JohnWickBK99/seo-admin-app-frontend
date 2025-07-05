import type { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Admin</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/dashboard/posts" className="hover:underline">
            Posts
          </Link>
          <Link href="/dashboard/categories" className="hover:underline">
            Categories
          </Link>
          <Link href="/dashboard/users" className="hover:underline">
            Users
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
