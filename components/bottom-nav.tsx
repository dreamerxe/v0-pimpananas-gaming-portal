"use client"

import { Gamepad2, ShoppingBag, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState("games")

  useEffect(() => {
    // Update active state based on current path
    if (pathname === "/") {
      setActive("games")
    } else if (pathname === "/shop") {
      setActive("shop")
    } else if (pathname === "/profile") {
      setActive("profile")
    } else if (pathname === "/settings") {
      setActive("settings")
    }
  }, [pathname])

  const navItems = [
    { id: "games", icon: Gamepad2, label: "Games", path: "/" },
    { id: "shop", icon: ShoppingBag, label: "Shop", path: "/shop" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
    { id: "settings", icon: Settings, label: "More", path: "/settings" },
  ]

  const handleNavigation = (item: typeof navItems[0]) => {
    setActive(item.id)
    router.push(item.path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20 backdrop-blur-md bg-background/95 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around px-2 py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-200",
                isActive && "text-primary",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "text-primary drop-shadow-[0_0_8px_rgba(255,226,71,0.6)]",
                )}
              />
              <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>{item.label}</span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}