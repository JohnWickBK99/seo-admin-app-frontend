"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon?: LucideIcon
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex flex-col space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({
                variant: isActive ? "default" : "ghost",
                size: "sm",
              }),
              isActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : "hover:bg-muted hover:text-foreground",
              "justify-start w-full",
              className
            )}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
} 