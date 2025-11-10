"use client"

import { Home, ShoppingCart, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()
  const [active, setActive] = useState<"games" | "shop" | "settings">("games")

  useEffect(() => {
    if (pathname === "/") setActive("games")
    else if (pathname === "/shop") setActive("shop")
    else if (pathname === "/settings") setActive("settings")
  }, [pathname])

  const navItems = [
    { id: "games", icon: Home, label: "Home", path: "/" },
    { id: "shop", icon: ShoppingCart, label: "Store", path: "/shop" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ] as const

  return (
    <nav className="fixed bottom-[calc(env(safe-area-inset-bottom)+6px)] inset-x-0 z-50">
      <div className="mx-auto max-w-sm px-3">
        <div
          className={cn(
            "flex items-center justify-around backdrop-blur-xl border border-white/30",
            "bg-white/80 shadow-md rounded-full px-1.5 py-1",
            "overflow-hidden",
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <Link
                key={item.id}
                href={item.path}
                prefetch={true}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 rounded-full transition-all duration-150",
                  "px-2 py-1 active:scale-95 select-none",
                  isActive ? "bg-white/60 shadow-sm" : "hover:bg-white/40",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-all duration-150",
                    isActive ? "text-[#4A7FE8]" : "text-gray-500 hover:text-gray-700",
                  )}
                  strokeWidth={isActive ? 2.4 : 2}
                />
                <span
                  className={cn(
                    "text-[9px] font-medium transition-colors duration-150",
                    isActive ? "text-[#4A7FE8]" : "text-gray-600",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
