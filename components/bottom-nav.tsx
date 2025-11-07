"use client"

import { Home, ShoppingCart, Settings } from "lucide-react"
import { useState, useEffect, useTransition } from "react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState("games")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    // Update active state based on current path
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

  const handleNavigation = (item: typeof navItems[0]) => {
    // Immediate visual feedback
    setActive(item.id)
    
    // Use startTransition for smoother navigation
    startTransition(() => {
      router.push(item.path)
    })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-inset-bottom">
      <div className="flex items-center justify-around px-6 py-3 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              disabled={isPending}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-6 transition-all duration-200 rounded-xl min-w-[80px] touch-manipulation",
                "active:scale-95",
                isActive && "bg-[#5B8FF9] shadow-lg scale-105",
                isPending && "opacity-50"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-all duration-200",
                  isActive ? "text-white" : "text-gray-500"
                )}
              />
              <span 
                className={cn(
                  "text-xs font-semibold transition-all duration-200",
                  isActive ? "text-white" : "text-gray-500"
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}