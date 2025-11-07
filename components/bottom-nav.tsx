"use client"

import { Home, ShoppingCart, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()
  const [active, setActive] = useState("games")

  useEffect(() => {
    if (pathname === "/") {
      setActive("games")
    } else if (pathname === "/shop") {
      setActive("shop")
    } else if (pathname === "/settings") {
      setActive("settings")
    }
  }, [pathname])

  const navItems = [
    { id: "games", icon: Home, label: "Home", path: "/" },
    { id: "shop", icon: ShoppingCart, label: "Store", path: "/shop" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] safe-area-inset-bottom">
      <div className="flex items-center justify-around px-8 py-2 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              href={item.path}
              prefetch={true}
              onClick={() => setActive(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 px-6 transition-all duration-150 rounded-xl touch-manipulation",
                "active:scale-95 tap-highlight-transparent",
                isActive && "scale-105",
              )}
            >
              <Icon
                className={cn("h-7 w-7 transition-colors duration-150", isActive ? "text-[#4A7FE8]" : "text-gray-400")}
              />
              <span
                className={cn(
                  "text-xs font-bold transition-colors duration-150",
                  isActive ? "text-[#4A7FE8]" : "text-gray-500",
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
