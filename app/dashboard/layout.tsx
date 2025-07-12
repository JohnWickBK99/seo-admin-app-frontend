"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { SidebarNav } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Posts",
    href: "/dashboard/posts",
    icon: FileText,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-col md:flex-row py-4">
        <aside className="w-full md:w-64 mb-6 md:mb-0 md:mr-6">
          <div className="py-2">
            <div className="mb-4">
              <h2 className="text-lg font-semibold tracking-tight">
                Admin Dashboard
              </h2>
            </div>
            <SidebarNav items={sidebarNavItems} />
            <Separator className="my-4" />
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
